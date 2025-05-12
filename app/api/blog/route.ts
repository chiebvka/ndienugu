import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase"; // Assuming you have this from Supabase CLI generation

// Define the structure for an API blog post item
interface ApiBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null; // Assuming excerpt might be directly available or derived
    cover_image: string | null;
    created_at: string; // Or a specific 'published_at' field
    author_name: string | null; // Added author_name
    tags: { id: string; name: string }[];
}

interface BlogApiResponse {
    items: ApiBlogPost[];
    total: number;
}

// Helper function to map Supabase blog post data
function mapSupabaseToApiBlogPost(
    post: Tables<"blogposts"> & { blogpost_tags: { tags: Pick<Tables<"tags">, "id" | "name" > }[] } & { profiles: Pick<Tables<"profiles">, "email"> | null }
): ApiBlogPost | null {
    // Assuming 'content' is JSON and you might derive an excerpt.
    // For now, let's assume an 'excerpt' field exists or use a placeholder.
    // If blogposts.content is a simple string, you can use it or truncate it.
    // If it's TipTap JSON, you'd need a server-side way to get plain text for excerpt.

    let excerpt = "Read more to find out..."; // Placeholder
    if (typeof post.content === 'string') {
        excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? "..." : "");
    } else if (post.content && typeof post.content === 'object' && !Array.isArray(post.content) && 'type' in post.content) {
        // Basic check if it looks like TipTap JSON object, proper parsing is complex server-side
        // For a real excerpt from TipTap JSON, you'd need a library or custom logic.
        // This is a very naive placeholder.
        const findText = (node: any): string => {
            if (node.type === 'text' && node.text) return node.text + " ";
            if (node.content && Array.isArray(node.content)) {
                return node.content.map(findText).join("");
            }
            return "";
        }
        const plainText = findText(post.content).trim();
        excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
    }

    let authorName: string | null = "Anonymous";
    if (post.profiles?.email) {
        authorName = post.profiles.email.split('@')[0];
    }

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: excerpt, // Use derived excerpt or a dedicated field from your DB
        cover_image: post.cover_image,
        created_at: post.created_at || new Date().toISOString(), // Fallback for created_at
        author_name: authorName,
        tags: post.blogpost_tags?.map(bt => bt.tags).filter(tag => !!tag) || [],
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items

    console.log(`[API /api/blog] GET request: page=${page}, limit=${limit}`);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 });
    }

    const offset = (page - 1) * limit;
    const supabase = await createClient();

    try {
        const query = supabase
            .from("blogposts")
            .select(`
                *,
                blogpost_tags (
                    tags (id, name)
                ),
                profiles ( email ) 
            `) // Joined with profiles
            .eq('status', 'published') // Assuming you only want published posts
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        const { data: posts, error: postsError, count } = await query;

        if (postsError) {
            console.error("[API /api/blog] Supabase error fetching blog posts:", postsError);
            return NextResponse.json({ error: "Failed to fetch blog posts", details: postsError.message }, { status: 500 });
        }

        console.log("[API /api/blog] Fetched posts count (page):", posts ? posts.length : 0);
        console.log("[API /api/blog] Total matching posts count:", count);

        const apiItems: ApiBlogPost[] = (posts || [])
            .map(post => mapSupabaseToApiBlogPost(post as any)) // `post as any` due to complex join type, ensure mapping is robust
            .filter((item): item is ApiBlogPost => item !== null);

        const response: BlogApiResponse = {
            items: apiItems,
            total: count || 0,
        };

        return NextResponse.json(response);

    } catch (error: any) {
        console.error("[API /api/blog] General GET error:", error);
        return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
    }
}
