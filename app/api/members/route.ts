import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dobDay: z.string().min(1, "Day of birth is required"),
  dobMonth: z.string().min(1, "Month of birth is required"),
  email: z.string().email(),
  mobile: z.string().min(11).regex(/^[0-9+]+$/),
  address: z.string().min(10),
  lga: z.string().min(1),
  bio: z.string().min(20).max(500),
});

// In-memory IP rate limit map
const rateLimit = new Map<string, { timestamp: number; count: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS = 3;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (entry) {
    const timePassed = now - entry.timestamp;
    if (timePassed < RATE_LIMIT_WINDOW) {
      if (entry.count >= MAX_SUBMISSIONS) {
        return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 });
      } else {
        entry.count++;
      }
    } else {
      rateLimit.set(ip, { timestamp: now, count: 1 });
    }
  } else {
    rateLimit.set(ip, { timestamp: now, count: 1 });
  }

  const supabase = await createClient();
  const body = await request.json();

  const parsed = formSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Form validation failed:", parsed.error.format());
    return NextResponse.json({ error: "Invalid form data.", details: parsed.error.format() }, { status: 400 });
  }

  const {
    firstName, lastName, dobDay, dobMonth, email, mobile, address, lga, bio
  } = parsed.data;

  try {
    console.log('Attempting to insert data:', {
      name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      address,
      lga,
      bio,
      status: 'pending',
      dob_day: dobDay,
      dob_month: dobMonth,
    });

    const { error } = await supabase
      .from('membership').insert({
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email,
        mobile,
        address,
        lga,
        bio,
        status: 'pending',
        dob_day: dobDay,
        dob_month: dobMonth,
      });

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    console.log('Submission successful for:', email);
    return NextResponse.json({ message: 'Submission received!' }, { status: 200 });

  } catch (err: any) {
    console.error('API Route General Error:', err);
    return NextResponse.json({ error: 'An unexpected server error occurred. Please try again later.' }, { status: 500 });
  }
}