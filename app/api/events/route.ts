import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase";

type EventRow = Tables<"events">;

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
  try {
    const body = await request.json();
    console.log("[API /api/events] POST request received for event registration (placeholder):", body);
    
    // Placeholder: Here you would eventually add logic to:
    // 1. Validate the input (eventId, user details, etc.)
    // 2. Interact with a database table (e.g., 'event_registrations') to store the interest.
    //    const supabase = createClient();
    //    const { data, error } = await supabase.from('event_registrations').insert([{...body, user_id: ...}]);

    // For now, just return a success message.
    return NextResponse.json({ message: "Event registration interest received (placeholder).", data: body }, { status: 201 });

  } catch (error: any) {
    console.error("[API /api/events] General POST error:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred during registration.", details: error.message }, { status: 500 });
  }
}
