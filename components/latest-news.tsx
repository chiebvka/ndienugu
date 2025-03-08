import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/types"
import { formatDate } from "@/lib/utils"

// This would typically come from a database or CMS
const latestPosts: BlogPost[] = [
  {
    id: 1,
    title: "Organization Secures Major Funding for Community Projects",
    excerpt:
      "We are pleased to announce that our organization has secured significant funding to support our community development initiatives over the next three years.",
    content: "Full content would go here...",
    date: "2023-12-10",
    author: "Communications Team",
    imageUrl: "/placeholder.svg?height=400&width=800",
    slug: "major-funding-announcement",
  },
  {
    id: 2,
    title: "New Partnership to Enhance Local Infrastructure",
    excerpt:
      "Our organization has formed a strategic partnership with key stakeholders to improve infrastructure in underserved communities.",
    content: "Full content would go here...",
    date: "2023-11-25",
    author: "Partnership Office",
    imageUrl: "/placeholder.svg?height=400&width=800",
    slug: "infrastructure-partnership",
  },
  {
    id: 3,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    imageUrl: "/placeholder.svg?height=400&width=800",
    slug: "annual-report-2023",
  },
]

export default function LatestNews() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
        <Link href="/blog" className="text-primary hover:underline font-medium">
          View all news
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {latestPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-600 mb-2">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-primary hover:underline font-medium">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

