import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/types"
import ShareButtons from "@/components/share-buttons"
import { formatDate } from "@/lib/utils"
import { CalendarDays, Clock, ChevronLeft } from "lucide-react"
import BlogPostSidebar from "@/components/blog-post-sidebar"
import { Metadata } from "next"

// This would typically come from a database or CMS
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Organization Secures Major Funding for Community Projects",
    excerpt:
      "We are pleased to announce that our organization has secured significant funding to support our community development initiatives over the next three years.",
    content: `
      <p>We are pleased to announce that our organization has secured significant funding to support our community development initiatives over the next three years.</p>
      
      <p>The funding, totaling $2.5 million, comes from a consortium of donors committed to sustainable development and community empowerment. This investment will enable us to expand our programs in education, healthcare, and economic development across the region.</p>
      
      <h2>Strategic Partnerships</h2>
      
      <p>"This funding represents a vote of confidence in our organization's vision and approach," said our Chairperson. "We are grateful for the trust placed in us and are committed to delivering impactful results that transform communities."</p>
      
      <p>The funds will be allocated to three main program areas:</p>
      
      <ul>
        <li>Education and skills development ($1 million)</li>
        <li>Community healthcare initiatives ($800,000)</li>
        <li>Economic empowerment programs ($700,000)</li>
      </ul>
      
      <h2>Implementation Plan</h2>
      
      <p>Implementation will begin next month, with the first phase focusing on needs assessment and community engagement to ensure programs are responsive to local priorities.</p>
      
      <blockquote>
        <p>Our approach has always been community-centered. This funding will allow us to deepen our engagement and expand our reach to more communities in need.</p>
        <cite>— Executive Director</cite>
      </blockquote>
      
      <p>We will provide regular updates on the progress of these initiatives through our website and quarterly reports to stakeholders.</p>
      
      <h2>Long-term Impact</h2>
      
      <p>This funding is expected to benefit over 50,000 community members through direct program participation and improved infrastructure. We anticipate measurable improvements in educational outcomes, health indicators, and economic opportunities within the first year.</p>
    `,
    date: "2023-12-10",
    author: "Communications Team",
    authorAvatar: "/placeholder.svg?height=100&width=100",
    imageUrl: "/board.png?height=800&width=1600",
    readTime: "5 min read",
    slug: "major-funding-announcement",
    tags: ["Funding", "Community Development", "Partnerships"],
    relatedPosts: [2, 3],
  },
  {
    id: 2,
    title: "New Partnership to Enhance Local Infrastructure",
    excerpt:
      "Our organization has formed a strategic partnership with key stakeholders to improve infrastructure in underserved communities.",
    content: "Full content would go here...",
    date: "2023-11-25",
    author: "Partnership Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "4 min read",
    slug: "infrastructure-partnership",
    tags: ["Infrastructure", "Partnerships", "Development"],
    relatedPosts: [1, 3],
  },
  {
    id: 3,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "6 min read",
    slug: "annual-report-2023",
    tags: ["Annual Report", "Achievements", "Transparency"],
    relatedPosts: [1, 2],
  },
  {
    id: 4,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "6 min read",
    slug: "annual-report-2023",
    tags: ["Annual Report", "Achievements", "Transparency"],
    relatedPosts: [1, 2],
  },
  {
    id: 5,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "6 min read",
    slug: "annual-report-2023",
    tags: ["Annual Report", "Achievements", "Transparency"],
    relatedPosts: [1, 2],
  },
  {
    id: 6,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "6 min read",
    slug: "annual-report-2023",
    tags: ["Annual Report", "Achievements", "Transparency"],
    relatedPosts: [1, 2],
  },
  {
    id: 7,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    authorAvatar: "/board.png?height=100&width=100",
    imageUrl: "/board.png?height=400&width=800",
    readTime: "6 min read",
    slug: "annual-report-2023",
    tags: ["Annual Report", "Achievements", "Transparency"],
    relatedPosts: [1, 2],
  },
]

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = post.relatedPosts?.map((id) => blogPosts.find((post) => post.id === id)).filter(Boolean) || []

  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero section */}
      <div className="relative h-[50vh] md:h-[60vh] bg-black">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
          <Link
            href="/blog"
            className="text-white/80 hover:text-white flex items-center gap-1 mb-6 w-fit transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to all articles</span>
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]  text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center text-white/80 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image src={post.authorAvatar || "/placeholder.svg"} alt={post.author} fill className="object-cover" />
              </div>
              <span>{post.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 mb-8">
          {/* Article content */}
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none mb-8 prose-headings:text-primary prose-headings:font-bold prose-a:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t border-gray-200 pt-8 mt-12">
              <h3 className="text-xl font-bold mb-4">Share this article</h3>
              <ShareButtons title={post.title} />
            </div>
          </div>
        </div>

        {/* Related posts and sidebar */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(
                (post) =>
                  post && (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{formatDate(post.date)}</p>
                        <p className="text-gray-700 mb-4 line-clamp-2">{post.excerpt}</p>
                        <span className="text-primary font-medium inline-flex items-center">
                          Read more <ChevronLeft className="rotate-180 ml-1" size={16} />
                        </span>
                      </div>
                    </Link>
                  ),
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <BlogPostSidebar />
          </div>
        </div> */}
      </div>
    </div>
  )
}

