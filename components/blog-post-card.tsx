import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/types"
import { formatDate } from "@/lib/utils"

interface BlogPostCardProps {
  post: BlogPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={post.imageUrl || "/placeholder.svg"} 
          alt={post.title} 
          fill 
          className="object-cover transition-all duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-gray-600 mb-2">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link 
          href={`/blog/${post.slug}`} 
          className="text-[rgb(28,165,94)] hover:text-[rgb(28,165,94)]/80 font-medium text-sm mt-auto inline-flex items-center"
        >
          Read More
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

