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

export default async function Page({
  params, // Keep the type as Promise<{ slug: string }>
}: {
  params: Promise<{ slug: string }>
}) {
  // Await the promise first to get the actual parameters object
  const resolvedParams = await params;

  // Now, validate the slug from the resolved object
  if (!resolvedParams || typeof resolvedParams.slug !== 'string' || resolvedParams.slug.trim() === "") {
    console.error("[Page] Error: Slug is missing, not a string, or empty in resolved params:", resolvedParams);
    notFound();
    // Return null is technically not needed after notFound(), but can satisfy some linters
    return null;
  }

  // Use the validated slug
  const slug = resolvedParams.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
    return null; // As above
  }

  // For type safety (though should be unreachable if notFound works)
  if (!post) {
      return null;
  }

  return (
    <div className="bg-background pb-16"> {/* Using bg-background for theme consistency */}
      <Slugfeed post={post} />
    </div>
  );
}

