import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase";

// Ensure FeedPost type matches what Feedwizard expects and what membership_feed table provides
type FeedPost = Tables<"membership_feed">;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  console.log(`[API /api/members/feed/all] Received request: page=${page}, limit=${limit}`);

  if (isNaN(page) || page < 1) {
    console.error("[API /api/members/feed/all] Invalid page number:", searchParams.get("page"));
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    console.error("[API /api/members/feed/all] Invalid limit value:", searchParams.get("limit"));
    return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
  }

  const offset = (page - 1) * limit;
  const supabase = await createClient();

  try {
    console.log(`[API /api/members/feed/all] Fetching posts from 'membership_feed' table. Range: ${offset} to ${offset + limit - 1}`);
    // Fetch paginated posts
    const { data: posts, error: postsError } = await supabase
      .from("membership_feed")
      .select("*") // Select all columns or specify needed ones
      .order("created_at", { ascending: false }) // Assuming you want newest first
      .range(offset, offset + limit - 1);

    if (postsError) {
      console.error("[API /api/members/feed/all] Supabase error fetching posts:", postsError);
      return NextResponse.json({ error: "Failed to fetch feed posts", details: postsError.message }, { status: 500 });
    }
    console.log("[API /api/members/feed/all] Fetched posts:", posts ? posts.length : 0, "records");

    console.log("[API /api/members/feed/all] Fetching total count from 'membership_feed' table.");
    const { count, error: countError } = await supabase
      .from("membership_feed")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("[API /api/members/feed/all] Supabase error fetching count:", countError);
      return NextResponse.json({ error: "Failed to fetch post count", details: countError.message }, { status: 500 });
    }
    console.log("[API /api/members/feed/all] Total count:", count);

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
    });

  } catch (error: any) {
    console.error("[API /api/members/feed/all] General error:", error);
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
} 