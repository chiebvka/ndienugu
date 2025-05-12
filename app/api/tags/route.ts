import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase";

type TagRow = Pick<Tables<"tags">, "id" | "name" | "slug">; // Select only needed fields

export async function GET() {
  console.log("[API /api/tags] GET request received");
  const supabase = await createClient();

  try {
    const { data: tags, error } = await supabase
      .from("tags")
      .select("id, name, slug") // Select only necessary fields
      .order("name", { ascending: true }); // Order alphabetically

    if (error) {
      console.error("[API /api/tags] Supabase error fetching tags:", error);
      return NextResponse.json({ error: "Failed to fetch tags", details: error.message }, { status: 500 });
    }

    console.log("[API /api/tags] Fetched tags count:", tags ? tags.length : 0);
    return NextResponse.json(tags as TagRow[]);

  } catch (error: any) {
    console.error("[API /api/tags] General GET error:", error);
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
