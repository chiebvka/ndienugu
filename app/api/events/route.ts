import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables, TablesInsert, Database } from "@/types/supabase";
import { z } from "zod";
import { createAnonClient } from "@/utils/supabase/anon";
import { createClient as createBasicClient } from '@supabase/supabase-js'; 

type EventRow = Tables<"events">;
type EventParticipantInsert = TablesInsert<"event_participant">;
type EventGuestInsert = TablesInsert<"event_guest">;

// --- Rate Limiting Setup (similar to app/api/members/route.ts) ---
const rateLimit = new Map<string, { timestamp: number; count: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5; // Max 5 registration attempts per IP per hour (adjust as needed)
// --- End Rate Limiting Setup ---

// Zod schema for validating the registration data
const guestSchema = z.object({
  id: z.number(), // Client-side ID for list management
  name: z.string().min(1, "Guest name is required"),
  age: z.enum(["1-12", "13-17", "18+"], { required_error: "Age range is required for guest" }),
  sex: z.enum(["male", "female", ""]),
});

const registrationSchema = z.object({
  eventId: z.string().uuid("Invalid Event ID format"),
  registrant: z.object({
    name: z.string().min(1, "Registrant name is required"),
    email: z.string().email("Invalid email format"),
    age: z.enum(["1-12", "13-17", "18+"], { required_error: "Registrant age range is required" }),
    sex: z.enum(["male", "female", ""]),
  }),
  additionalGuests: z.array(guestSchema).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  console.log(`[API /api/events] GET request: page=${page}, limit=${limit}`);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
  }

  const offset = (page - 1) * limit;
  const supabase = await createClient();

  // Get current date in YYYY-MM-DD format for comparison
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  const currentDateString = `${year}-${month}-${day}`;

  try {
    // Fetch paginated future events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", currentDateString) // Filter for events on or after today
      .order("event_date", { ascending: true }) // Show soonest future events first
      .order("event_time", { ascending: true, nullsFirst: false }) // Then by time
      .range(offset, offset + limit - 1);

    if (eventsError) {
      console.error("[API /api/events] Supabase error fetching events:", eventsError);
      return NextResponse.json({ error: "Failed to fetch events", details: eventsError.message }, { status: 500 });
    }
    console.log("[API /api/events] Fetched events count:", events ? events.length : 0);

    // Fetch total count of future events for pagination
    const { count, error: countError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", currentDateString);

    if (countError) {
      console.error("[API /api/events] Supabase error fetching total event count:", countError);
      return NextResponse.json({ error: "Failed to fetch event count", details: countError.message }, { status: 500 });
    }
    console.log("[API /api/events] Total future events count:", count);

    return NextResponse.json({
      events: (events || []) as EventRow[],
      total: count || 0,
    });

  } catch (error: any) {
    console.error("[API /api/events] General GET error:", error);
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // --- Apply Rate Limiting ---
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const entry = rateLimit.get(ip);

  console.log(`[API /api/events] POST request from IP: ${ip}`);

  if (entry) {
    const timePassed = now - entry.timestamp;
    if (timePassed < RATE_LIMIT_WINDOW) {
      if (entry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
        console.log(`[API /api/events] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
          { message: "Too many registration attempts. Please try again later." },
          { status: 429 } // HTTP 429 Too Many Requests
        );
      }
      entry.count++;
    } else {
      // Reset window
      rateLimit.set(ip, { timestamp: now, count: 1 });
    }
  } else {
    rateLimit.set(ip, { timestamp: now, count: 1 });
  }
  // --- End Rate Limiting ---

  try {
    const body = await request.json();
    console.log("[API /api/events] POST request received for event registration:", body);

    const parsedData = registrationSchema.safeParse(body);

    if (!parsedData.success) {
      console.error("[API /api/events] Invalid registration data:", parsedData.error.format());
      return NextResponse.json({ error: "Invalid registration data.", details: parsedData.error.format() }, { status: 400 });
    }

    const { eventId, registrant, additionalGuests = [] } = parsedData.data;

    let adultCount = 0;
    let kidCount = 0;
    let teenCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let totalPeople = 0;

    // Helper function to process an individual
    const processPerson = (person: { age: string; sex: string }) => {
        totalPeople++;
        if (person.age === "18+") {
            adultCount++;
        } else if (person.age === "13-17") {
            teenCount++;
        } else if (person.age === "1-12") {
            kidCount++;
        }

        if (person.sex === "male") {
            maleCount++;
        } else if (person.sex === "female") {
            femaleCount++;
        }
    };

    // Process registrant
    processPerson(registrant);

    // Process additional guests
    additionalGuests.forEach(processPerson);

    const participantData: EventParticipantInsert = {
      event_id: eventId,
      adult: adultCount > 0 ? adultCount : null,
      kids: kidCount > 0 ? kidCount : null,
      teens: teenCount > 0 ? teenCount : null,
      males: maleCount > 0 ? maleCount : null,
      females: femaleCount > 0 ? femaleCount : null,
      people: totalPeople > 0 ? totalPeople : null,
    };

    console.log("[API /api/events] Inserting into event_participant:", participantData);

    const supabase = createBasicClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
      );

    // Insert into event_participant
    const { data: participantRecord, error: participantInsertError } = await supabase
      .from("event_participant")
      .insert(participantData as any)
      .select()
      .single();

    if (participantInsertError || !participantRecord) {
      console.error("[API /api/events] Supabase error inserting participant:", participantInsertError);
      return NextResponse.json({ error: "Failed to record event participation.", details: participantInsertError?.message }, { status: 500 });
    }

    console.log("[API /api/events] Event participation recorded successfully:", participantRecord);

    // Now, insert into event_guest
    const guestsToInsert: EventGuestInsert[] = [];

    // Add main registrant as a guest
    guestsToInsert.push({
      event_id: eventId,
      event_participant_id: participantRecord.id,
      name: registrant.name,
      email: registrant.email,
    });

    // Add additional guests
    additionalGuests.forEach(guest => {
      guestsToInsert.push({
        event_id: eventId,
        event_participant_id: participantRecord.id,
        name: guest.name,
        email: null, // Email is not collected for additional guests per current requirement
      });
    });

    if (guestsToInsert.length > 0) {
      console.log("[API /api/events] Inserting into event_guest:", guestsToInsert);
      const { error: guestInsertError } = await supabase
        .from("event_guest")
        .insert(guestsToInsert);

      if (guestInsertError) {
        console.error("[API /api/events] Supabase error inserting guests:", guestInsertError);
        // Potentially consider rolling back the event_participant insert or logging for manual reconciliation
        return NextResponse.json({ error: "Failed to record guest details.", details: guestInsertError.message }, { status: 500 });
      }
      console.log("[API /api/events] Guest details recorded successfully.");
    }

    return NextResponse.json({ message: "Event registration successful!", participantRecordId: participantRecord.id }, { status: 201 });

  } catch (error: any) {
    console.error("[API /api/events] General POST error:", error);
    if (error instanceof SyntaxError) { // Catch JSON parsing errors specifically
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred during registration.", details: error.message }, { status: 500 });
  }
}
