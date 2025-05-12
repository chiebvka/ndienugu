import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase";

// Updated ApiGalleryItem to include all galleryimages
interface ApiGalleryItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  mediaType: "image" | "video"; // Derived from galleryposts.type
  // mediaUrl: string; // This will now be the first image, or a cover
  tags: { id: string; name: string }[];
  category: string;
  slug: string;
  galleryImages: Pick<Tables<"galleryimages">, "id" | "image_url" | "alt_text">[]; // All images for this post
  coverImageUrl?: string; // Optional: A specific cover image if you add one to galleryposts
}

interface GalleryApiResponse {
  items: ApiGalleryItem[];
  total: number;
  // Years will be derived on the frontend now
}

// Helper function to map Supabase data
function mapSupabaseToApiGalleryItem(
  post: Tables<"galleryposts"> & { galleryimages: Pick<Tables<"galleryimages">, "id" | "image_url" | "alt_text">[] } & { gallerypost_tags: { tags: Pick<Tables<"tags">, "id" | "name"> }[] },
): ApiGalleryItem | null {
    // Use the first image as a representative thumbnail/cover if no specific cover_image_url is on galleryposts
    const coverImage = post.galleryimages?.[0]?.image_url;

    if (!coverImage && post.galleryimages?.length === 0 && post.type?.toLowerCase() !== 'video') {
        // Only warn if it's not a video post and has no images at all.
        // Video posts might not have galleryimages if the video URL is directly on galleryposts table.
        console.warn(`[API /api/gallery] Gallery post ${post.id} (type: ${post.type}) has no associated images to use as a cover.`);
        // Depending on requirements, you might still want to return it if it's a video post with a video URL elsewhere
    }

    const mediaType = post.type?.toLowerCase() === "video" ? "video" : "image";

    return {
        id: post.id,
        title: post.title,
        description: post.description,
        date: post.date,
        mediaType: mediaType,
        tags: post.gallerypost_tags?.map(gt => gt.tags).filter(tag => !!tag) || [],
        category: post.type || "Uncategorized", // Use 'type' (e.g., "Event", "Meeting") as category
        slug: post.slug,
        galleryImages: post.galleryimages || [],
        coverImageUrl: coverImage, // Use the first image as cover, or you can add a specific field to galleryposts
    };
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 for "load more"
  // Removed yearFilter, categoryFilter, tagsFilter, mediaTypeFilter from API query params
  // These will be handled by frontend filtering after fetching all (or paginated) data.

  console.log(`[API /api/gallery] GET request: page=${page}, limit=${limit}`);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 });
  }

  const offset = (page - 1) * limit;
  const supabase = await createClient();

  try {
    // --- Fetch Gallery Items with Pagination ---
    // No server-side filtering by year, category, or tags anymore.
    // We fetch all gallery images associated with each post.
    const query = supabase
      .from("galleryposts")
      .select(`
        *,
        galleryimages (id, image_url, alt_text),
        gallerypost_tags (tags (id, name))
      `, { count: "exact" })
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: posts, error: postsError, count } = await query;

    if (postsError) {
      console.error("[API /api/gallery] Supabase error fetching gallery posts:", postsError);
      return NextResponse.json({ error: "Failed to fetch gallery posts", details: postsError.message }, { status: 500 });
    }

    console.log("[API /api/gallery] Fetched posts count (page):", posts ? posts.length : 0);
    console.log("[API /api/gallery] Total matching posts count:", count);

    const apiItems: ApiGalleryItem[] = (posts || [])
        .map(post => mapSupabaseToApiGalleryItem(post as any))
        .filter((item): item is ApiGalleryItem => item !== null);

    const response: GalleryApiResponse = {
      items: apiItems,
      total: count || 0,
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[API /api/gallery] General GET error:", error);
    if (error.code === 'PGRST202' && error.message.includes('get_distinct_gallery_years')) {
        // This specific error means the DB function is still an issue.
        console.error("[API /api/gallery] CRITICAL: Database function 'get_distinct_gallery_years' not found or misconfigured.");
        return NextResponse.json({ error: "Database configuration error for gallery years.", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
// The get_distinct_gallery_years function is no longer called by this API.
// You can remove the SQL comment if you've confirmed the function is fixed or no longer needed.
