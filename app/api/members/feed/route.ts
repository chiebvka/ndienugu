import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"), // Changed from name to firstName
  email: z.string().email("Invalid email address"),
});

// In-memory IP rate limit map
const rateLimit = new Map<string, { timestamp: number; count: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 500; // Limit access attempts

export async function POST(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const entry = rateLimit.get(ip);

  console.log(`[API /api/members/feed] Request from IP: ${ip}`);

  if (entry) {
    const timePassed = now - entry.timestamp;
    if (timePassed < RATE_LIMIT_WINDOW) {
      if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
        console.log(`[API /api/members/feed] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429 }
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

  try {
    const body = await request.json();
    console.log("[API /api/members/feed] Received request body:", body);
    const parsed = formSchema.safeParse(body);

    if (!parsed.success) {
      console.log("[API /api/members/feed] Input validation failed:", parsed.error.format());
      return NextResponse.json(
        { message: "Invalid input.", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { firstName, email } = parsed.data;
    const trimmedEmail = email.trim();
    const inputFirstName = firstName.trim().toLowerCase();
    
    console.log(`[API /api/members/feed] Preparing to verify:
      - Frontend First Name (processed): '${inputFirstName}'
      - Frontend Email (trimmed): '${trimmedEmail}'`);

    const supabase = await createClient();

    console.log(`[API /api/members/feed] Querying 'membership' table: SELECT first_name, status, email WHERE 'email' (db column) ILIKE '${trimmedEmail}' (frontend input, case-insensitive)`);
    const { data: membersData, error: dbError } = await supabase
      .from("membership")
      .select("first_name, status, email")
      .ilike("email", trimmedEmail); 

    if (dbError) {
      // PGRST116 would have been caught here if .maybeSingle() was used and multiple rows returned.
      // Now, dbError will be for other types of database errors.
      console.error("[API /api/members/feed] Supabase DB Error during email lookup:", dbError);
      return NextResponse.json(
        { message: "Error verifying membership. Please try again." },
        { status: 500 }
      );
    }

    if (!membersData || membersData.length === 0) {
      console.log(`[API /api/members/feed] Email lookup result: NOT FOUND. No record in 'membership' table with email ILIKE '${trimmedEmail}'.`);
      return NextResponse.json(
        {
          message:
            "Access denied. Your email is not registered. Please contact secretary@ndienugu.co.uk to check on your membership status.",
        },
        { status: 403 }
      );
    }
    
    let memberData: (typeof membersData)[0] | null = null;
    let foundApprovedMatch = false;
    let foundPendingMatchForName = false;

    for (const record of membersData) {
        const dbFirstName = record.first_name ? record.first_name.trim().toLowerCase() : null;
        if (dbFirstName && dbFirstName === inputFirstName) {
            if (record.status === "approved") {
                memberData = record;
                foundApprovedMatch = true;
                break;
            } else if (record.status === "pending" && !memberData) { 
                memberData = record;
                foundPendingMatchForName = true;
            } else if (!memberData) {
                memberData = record;
            }
        }
    }
    
    if (!foundApprovedMatch && foundPendingMatchForName) {
        const pendingMatch = membersData.find(r => {
            const dbFirstNamePending = r.first_name ? r.first_name.trim().toLowerCase() : null;
            return dbFirstNamePending && dbFirstNamePending === inputFirstName && r.status === "pending";
        });
        if (pendingMatch) memberData = pendingMatch;
    }

    if (membersData.length > 1) {
      console.warn(`[API /api/members/feed] INFO: Multiple (${membersData.length}) records found for email '${trimmedEmail}'. Searched for best match. Records:`, membersData);
    }

    if (!memberData) {
      const anyRecordForEmail = membersData[0];
      const dbFirstNameAnyRecord = anyRecordForEmail?.first_name ? anyRecordForEmail.first_name.trim().toLowerCase() : null;

      if (dbFirstNameAnyRecord && dbFirstNameAnyRecord !== inputFirstName){
        console.log(`[API /api/members/feed] Email found, but no record for this email matches the input first name '${inputFirstName}'. First record's name from DB (processed): '${dbFirstNameAnyRecord}', Original from DB: '${anyRecordForEmail?.first_name}'`);
         return NextResponse.json(
            {
              message:
                "Access denied. The name provided does not match the registered first name for this email. Please contact secretary@ndienugu.co.uk.",
            },
            { status: 403 }
          );
      }
       console.log(`[API /api/members/feed] Email found, but no suitable record after filtering for first name '${inputFirstName}'. All records for email:`, membersData);
       return NextResponse.json(
        {
          message:
            "Access denied. The name provided does not match any registered first name for this email, or your account status is not eligible. Please contact secretary@ndienugu.co.uk.",
        },
        { status: 403 }
      );
    }

    console.log("[API /api/members/feed] Using best match member data:", memberData);

    const memberDataFirstNameProcessed = memberData.first_name ? memberData.first_name.trim().toLowerCase() : null;

    if (
      !memberDataFirstNameProcessed || 
      inputFirstName !== memberDataFirstNameProcessed
    ) {
      console.log(`[API /api/members/feed] Fallback Name comparison result: MISMATCH. 
        DB 'first_name' (processed: '${memberDataFirstNameProcessed}', original: '${memberData.first_name}') vs Frontend First Name (processed: '${inputFirstName}').`);
      return NextResponse.json(
        {
          message:
            "Access denied. The name provided does not match the registered first name for this email. Please contact secretary@ndienugu.co.uk.",
        },
        { status: 403 }
      );
    }

    console.log(`[API /api/members/feed] Name match confirmed for user ${memberData.email} with name (original from DB) '${memberData.first_name}'. 
      Proceeding to check 'status' column in database: '${memberData.status}'`);
    if (memberData.status === "approved") {
      console.log("[API /api/members/feed] Status check: 'approved'. Access GRANTED.");
      return NextResponse.json(
        { message: "Access granted! Welcome to the member feed." },
        { status: 200 }
      );
    } else if (memberData.status === "pending") {
      console.log("[API /api/members/feed] Status check: 'pending'. Access DENIED (pending).");
      return NextResponse.json(
        {
          message:
            "Your membership application is currently pending review. Please contact secretary@ndienuguscotland.org to check on your application status.",
        },
        { status: 403 }
      );
    } else {
      console.log(`[API /api/members/feed] Status check: '${memberData.status}'. Access DENIED (other status).`);
      return NextResponse.json(
        {
          message:
            "Access denied. Your membership status does not permit access. Please contact secretary@ndienugu.co.uk.",
        },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error("[API /api/members/feed] Unexpected API Error at the end of try block:", error);
    let message = "An unexpected error occurred.";
    if (error instanceof SyntaxError) { 
        message = "Invalid request format."
    }
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
