import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Define the props based on ApiBlogPost structure
interface ApiTag {
    id: string;
    name: string;
}

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    created_at: string;
    author_name: string | null;
    tags: ApiTag[];
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link  href={`/blog/${post.slug}`} className="bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow duration-300">
      {post.cover_image && (
        <div aria-label={`Read more about ${post.title}`} className="block relative h-48 sm:h-56 overflow-hidden">
            <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
        </div>
      )}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          {post.author_name && <span className="font-medium capitalize">{post.author_name}</span>}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          <span >{post.title}</span>
        </h3>
        {post.excerpt && (
            <div className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => ( // Show max 3 tags
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <span
          
          className="text-primary hover:text-primary/80 font-medium text-sm mt-auto inline-flex items-center group-hover:underline"
        >
          Read More
          <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}

