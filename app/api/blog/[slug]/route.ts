import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/supabase";

// Re-using the same interface as the list API for consistency
interface ApiBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | Tables<"blogposts">['content']; // Keep content as its original type for TipTap
    cover_image: string | null;
    created_at: string;
    author_name: string | null;
    tags: { id: string; name: string }[];
    // Add any other fields you need for the single post view, like full content
}

// Re-using and potentially adapting the mapping function
function mapSupabaseToApiBlogPostDetail(
    post: Tables<"blogposts"> & { blogpost_tags: { tags: Pick<Tables<"tags">, "id" | "name"> }[] } & { profiles: Pick<Tables<"profiles">, "email"> | null }
): ApiBlogPost | null {
    if (!post) return null;

    let excerpt = "Read more to find out...";
    // If your 'content' is TipTap JSON, generating a server-side excerpt can be complex.
    // It's often better to have a dedicated 'excerpt' field in your database.
    // For now, we'll assume if post.content is string, it might be simple text or pre-rendered.
    // If it's an object, it's likely TipTap JSON, and we'll pass it as is.
    if (typeof post.content === 'string') {
         // This is a very basic excerpt if content is a long string.
        excerpt = post.content.substring(0, 200) + (post.content.length > 200 ? "..." : "");
    } else if (post.content && typeof post.content === 'object' && 'type' in post.content) {
        // Placeholder for excerpt from TipTap JSON. A proper solution is more involved.
        // Consider setting an explicit excerpt during content creation.
        const findText = (node: any): string => {
            if (node.type === 'text' && node.text) return node.text + " ";
            if (node.content && Array.isArray(node.content)) {
                return node.content.map(findText).join("");
            }
            return "";
        }
        const plainText = findText(post.content).trim();
        excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
    }


    let authorName: string | null = "Anonymous";
    if (post.profiles?.email) {
        authorName = post.profiles.email.split('@')[0];
    }

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: excerpt, // Use a dedicated excerpt field if possible
        content: post.content, // Return the full content (TipTap JSON or HTML)
        cover_image: post.cover_image,
        created_at: post.created_at || new Date().toISOString(),
        author_name: authorName,
        tags: post.blogpost_tags?.map(bt => bt.tags).filter(tag => !!tag) || [],
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;
    console.log(`[API /api/blog/${slug}] GET request for slug: ${slug}`);

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const supabase = await createClient();

    try {
        const { data: post, error } = await supabase
            .from("blogposts")
            .select(`
                *,
                blogpost_tags (
                    tags (id, name)
                ),
                profiles ( email )
            `)
            .eq("slug", slug)
            .eq('status', 'published') // Ensure only published posts are fetched
            .single(); // We expect only one post for a given slug

        if (error) {
            if (error.code === 'PGRST116') { // PostgREST error for " İlişkili satır bulunamadı" (No related row found)
                console.warn(`[API /api/blog/${slug}] Blog post with slug "${slug}" not found or not published.`);
                return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
            }
            console.error(`[API /api/blog/${slug}] Supabase error:`, error);
            return NextResponse.json({ error: "Failed to fetch blog post", details: error.message }, { status: 500 });
        }

        if (!post) {
            console.warn(`[API /api/blog/${slug}] Blog post with slug "${slug}" not found (after query).`);
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        const formattedPost = mapSupabaseToApiBlogPostDetail(post as any);

        if (!formattedPost) {
             return NextResponse.json({ error: "Failed to process blog post data" }, { status: 500 });
        }

        return NextResponse.json(formattedPost);

    } catch (error: any) {
        console.error(`[API /api/blog/${slug}] General GET error:`, error);
        return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
    }
}
