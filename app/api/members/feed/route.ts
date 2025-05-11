import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Full name is required"), // Expecting full name, will extract first name
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

    const { name, email } = parsed.data;
    const trimmedEmail = email.trim();
    const inputFirstName = name.trim().split(" ")[0];
    
    console.log(`[API /api/members/feed] Preparing to verify:
      - Frontend Full Name: '${name}' (Derived First Name: '${inputFirstName}')
      - Frontend Email: '${trimmedEmail}'`);

    const supabase = await createClient();

    console.log(`[API /api/members/feed] Querying 'membership' table: SELECT first_name, status, email WHERE 'email' (db column) ILIKE '${trimmedEmail}' (frontend input, case-insensitive)`);
    // Fetch member by email - remove .maybeSingle() to get an array
    const { data: membersData, error: dbError } = await supabase
      .from("membership")
      .select("first_name, status, email")
      .ilike("email", trimmedEmail); // Case-insensitive email match against 'email' column
      // .maybeSingle(); // Removed to handle multiple potential matches

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
    
    // Find the best match from the returned records
    // A "best match" would be one where the first name matches (case-insensitively)
    // and ideally, the status is 'approved'.
    // If multiple match name and are approved, the first one found is fine.
    // If one matches name and is approved, use that.
    // If one matches name but is pending, use that to give pending message.
    // Otherwise, it's a name mismatch or no suitable record.

    let memberData: (typeof membersData)[0] | null = null;
    let foundApprovedMatch = false;
    let foundPendingMatchForName = false;

    for (const record of membersData) {
        if (record.first_name && record.first_name.toLowerCase() === inputFirstName.toLowerCase()) {
            if (record.status === "approved") {
                memberData = record;
                foundApprovedMatch = true;
                break; // Found an approved match for the name, use this one.
            } else if (record.status === "pending" && !memberData) { 
                // If we haven't found an approved one yet, keep a pending one as a candidate
                memberData = record;
                foundPendingMatchForName = true;
            } else if (!memberData) {
                 // If no approved or pending yet for this name, take any record that matches the name
                memberData = record;
            }
        }
    }
    
    // If after checking all records, we didn't find an approved match, 
    // but we found a pending match for the name, ensure memberData points to it.
    if (!foundApprovedMatch && foundPendingMatchForName) {
        // This logic is slightly redundant if the loop already set memberData for pending,
        // but it makes the priority explicit.
        // Re-iterate to be certain to pick a pending one if an approved one wasn't found for the name.
        const pendingMatch = membersData.find(r => r.first_name && r.first_name.toLowerCase() === inputFirstName.toLowerCase() && r.status === "pending");
        if (pendingMatch) memberData = pendingMatch;
    }

    if (membersData.length > 1) {
      console.warn(`[API /api/members/feed] INFO: Multiple (${membersData.length}) records found for email '${trimmedEmail}'. Searched for best match. Records:`, membersData);
    }

    if (!memberData) {
      // This means either:
      // 1. No records had a matching first_name.
      // 2. Or records matched first_name, but none were suitable (e.g. all declined and we didn't explicitly keep them)
      //    The original code would have used membersData[0] which might have led to a name mismatch if that first record didn't match the input name.
      //    Or it could be that the email was found, but no record associated with that email matched the input first_name.
      const anyRecordForEmail = membersData[0]; // For providing a consistent error if name doesn't match ANY record for that email.
      if (anyRecordForEmail && anyRecordForEmail.first_name && anyRecordForEmail.first_name.toLowerCase() !== inputFirstName.toLowerCase()){
        console.log(`[API /api/members/feed] Email found, but no record for this email matches the input first name '${inputFirstName}'. First record's name: '${anyRecordForEmail.first_name}'`);
         return NextResponse.json(
            {
              message:
                "Access denied. The name provided does not match the registered first name for this email. Please contact secretary@ndienugu.co.uk.",
            },
            { status: 403 }
          );
      }
       // If we reach here, it means the email was found, but something is still off.
       // This could be that first_name was null on all matching email records, or some other edge case.
       // Default to the "name mismatch" or a generic error.
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
    // This log for comparing names is now less critical if the loop above found a direct name match
    // console.log(`[API /api/members/feed] Now comparing names:
    //   - Database 'first_name': '${memberData.first_name}'
    //   - Frontend Derived First Name: '${inputFirstName}' (comparison will be case-insensitive)`);

    // The 'if' condition for name mismatch is no longer strictly needed here
    // if the loop guarantees memberData.first_name matches inputFirstName.
    // However, keeping it as a safeguard for memberData.first_name being null/undefined.
    if (
      !memberData.first_name || 
      inputFirstName.toLowerCase() !== memberData.first_name.toLowerCase()
    ) {
      // This block should ideally not be hit if the loop logic is correct and a name match was required to set memberData.
      // But it's a fallback.
      console.log(`[API /api/members/feed] Fallback Name comparison result: MISMATCH. 
        DB 'first_name' ('${memberData.first_name}') vs Frontend Derived First Name ('${inputFirstName}'). This shouldn't happen if best match logic worked.`);
      return NextResponse.json(
        {
          message:
            "Access denied. The name provided does not match the registered first name for this email. Please contact secretary@ndienugu.co.uk.",
        },
        { status: 403 }
      );
    }

    console.log(`[API /api/members/feed] Name match confirmed for user ${memberData.email} with name ${memberData.first_name}. 
      Proceeding to check 'status' column in database: '${memberData.status}'`);
    // Check status
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
