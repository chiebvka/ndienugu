import React from 'react';
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/types"
import ShareButtons from "@/components/share-buttons"
import { formatDate } from "@/lib/utils"
import { CalendarDays, Clock, ChevronLeft } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { ProseTiptap } from '@/components/prose-tiptap';
import { baseUrl } from "@/utils/universal";


// Define the expected prop type based on the API response
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
    readTime?: string; // Assuming readTime is calculated or comes from DB
}

interface SlugfeedProps {
  post: ApiBlogPost;
}

export default function Slugfeed({ post }: SlugfeedProps) {
  if (!post) {
    // This case should ideally be handled by the parent page with notFound()
    return <div>Error: Post data is not available.</div>;
  }

  // Basic read time calculation (words per minute)
  const calculateReadTime = (content: any): string => {
    if (!content) return "N/A";
    let textContent = "";
    if (typeof content === 'string') {
        textContent = content.replace(/<[^>]+>/g, ''); // Strip HTML for string content
    } else if (typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
        // Basic recursive text extraction for TipTap JSON
        const extractText = (nodes: any[]): string => {
            return nodes.map(node => {
                if (node.type === 'text' && node.text) return node.text;
                if (node.content && Array.isArray(node.content)) return extractText(node.content);
                return '';
            }).join(' ');
        };
        textContent = extractText(content.content);
    }
    const wordsPerMinute = 200;
    const noOfWords = textContent.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    return `${readTime} min read`;
  };

  const readTime = post.readTime || calculateReadTime(post.content);
  const fullPostUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <div>
      {/* Hero section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-black">
        {post.cover_image && (
            <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover opacity-60" // Slightly less opacity for better text contrast
            priority
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8 sm:pb-12">
          <Link
            href="/blog"
            className="text-white/90 hover:text-white flex items-center gap-1 mb-4 sm:mb-6 w-fit transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {post.tags.map((tag) => (
                <Badge key={tag.id} className="bg-green-500/20 text-green-300 border-green-500/30 text-xs sm:text-sm hover:bg-green-500/30">
                    {tag.name}
                </Badge>
                ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center text-white/80 gap-x-4 gap-y-2 text-xs sm:text-sm">
            {post.author_name && (
                <div className="flex items-center gap-2">
                    {/* Optional: Add author avatar if available */}
                    {/* <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white/50">
                        <Image src={"/placeholder.svg"} alt={post.author_name} fill className="object-cover" />
                    </div> */}
                    <span className="font-medium capitalize">{post.author_name}</span>
                </div>
            )}

            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 -mt-8 sm:-mt-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* TipTap Content Rendering */}
            <ProseTiptap content={post.content} />

            <div className="border-t pt-8 mt-10 sm:mt-12">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Share this article</h3>
              <ShareButtons title={post.title} url={fullPostUrl} />
            </div>
          </div>
        </div>

        {/* Related posts can be added back here if fetched by the parent page or another API call */}
      </div>
    </div>
  )
}