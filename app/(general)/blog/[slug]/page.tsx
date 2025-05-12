import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/types"
import ShareButtons from "@/components/share-buttons"
import { formatDate } from "@/lib/utils"
import { CalendarDays, Clock, ChevronLeft } from "lucide-react"
import BlogPostSidebar from "@/components/blog-post-sidebar"
import { Metadata, ResolvingMetadata } from "next"
import Slugfeed from "./_components/slug-feed"

// This would typically come from a database or CMS
interface ApiTag {
    id: string;
    name: string;
}
interface ApiBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: any; // TipTap content can be JSON object
    cover_image: string | null;
    created_at: string;
    author_name: string | null;
    tags: ApiTag[];
    // readTime?: string; // Calculated in Slugfeed
}

// Helper function to fetch post data (can be in a separate lib file)
async function getPostBySlug(slug: string): Promise<ApiBlogPost | null> {
    // In a real app, you'd use your deployed URL or an environment variable
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    console.log(`[getPostBySlug] Fetching post with slug: ${slug} from ${baseUrl}/api/blog/${slug}`);
    try {
        const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 60 } }); // Revalidate every 60s
        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`[getPostBySlug] Post with slug "${slug}" not found (404).`);
                return null;
            }
            console.error(`[getPostBySlug] Failed to fetch post "${slug}": ${res.status} ${res.statusText}`);
            // Optionally, you could try to read the error response body if available
            // const errorBody = await res.text();
            // console.error(`[getPostBySlug] Error body: ${errorBody}`);
            return null; // Return null instead of throwing to be handled by notFound()
        }
        return res.json();
    } catch (error) {
        console.error(`[getPostBySlug] Error fetching post by slug "${slug}":`, error);
        return null;
    }
}

type Props = {
  params: { slug: string };
};

// Generate Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!params || typeof params.slug !== 'string' || params.slug.trim() === "") {
    console.error("[generateMetadata] Error: Slug is missing, not a string, or empty in params:", params);
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found or loaded due to an issue with the request.",
    };
  }
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: `The blog post with slug "${slug}" could not be found.`,
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = post.cover_image 
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${siteUrl}${post.cover_image}`) 
    : `${siteUrl}/default-og-image.png`; // Ensure you have a default OG image

  return {
    title: post.title,
    description: post.excerpt || "Read this interesting blog post.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read this interesting blog post.",
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: "Ndi Enugu Scotland", // Replace with your site name
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.created_at,
      authors: post.author_name ? [post.author_name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read this interesting blog post.",
      images: [imageUrl],
      // creator: '@yourTwitterHandle', // Optional: Your Twitter handle
    },
    // alternates: {
    //   canonical: `${siteUrl}/blog/${post.slug}`,
    // },
  };
}

export default async function Page({ params }: Props) {
  if (!params || typeof params.slug !== 'string' || params.slug.trim() === "") {
    console.error("[Page] Error: Slug is missing, not a string, or empty in params:", params);
    notFound();
    // TypeScript might not know notFound() exits, so a return can be good practice
    // depending on linting rules, but notFound() should terminate rendering.
  }
  // At this point, params and params.slug are assumed to be valid.
  // If notFound() was called, this part won't execute.
  const slug = params.slug; 
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
     // Similar to above, notFound() should handle it.
  }

  // If post is null here (after notFound() should have been called),
  // it means notFound() didn't terminate or there's a logic flow issue.
  // However, with Next.js conventions, notFound() should prevent rendering further.
  // For type safety with post potentially being null if notFound doesn't immediately stop TS analysis:
  if (!post) { 
      return null; // Should be unreachable if notFound() works as expected
  }

  return (
    <div className="bg-background pb-16"> {/* Using bg-background for theme consistency */}
      <Slugfeed post={post} />
    </div>
  );
}

