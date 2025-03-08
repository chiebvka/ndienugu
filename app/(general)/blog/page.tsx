"use client"

import type { BlogPost } from "@/types"
import BlogPostCard from "@/components/blog-post-card"
import PageHeader from "@/components/page-header"

// This would typically come from a database or CMS
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Organization Secures Major Funding for Community Projects",
    excerpt:
      "We are pleased to announce that our organization has secured significant funding to support our community development initiatives over the next three years.",
    content: "Full content would go here...",
    date: "2023-12-10",
    author: "Communications Team",
    imageUrl: "/board.png?height=400&width=800",
    slug: "major-funding-announcement",
    tags: ["Funding", "Community Development", "Projects"],
  },
  {
    id: 2,
    title: "New Partnership to Enhance Local Infrastructure",
    excerpt:
      "Our organization has formed a strategic partnership with key stakeholders to improve infrastructure in underserved communities.",
    content: "Full content would go here...",
    date: "2023-11-25",
    author: "Partnership Office",
    imageUrl: "/board.png?height=400&width=800",
    slug: "infrastructure-partnership",
    tags: ["Partnerships", "Infrastructure", "Development"],
  },
  {
    id: 3,
    title: "Annual Report Highlights Significant Progress",
    excerpt: "The release of our annual report demonstrates substantial achievements in all our key performance areas.",
    content: "Full content would go here...",
    date: "2023-10-30",
    author: "Executive Office",
    imageUrl: "/board.png?height=400&width=800",
    slug: "annual-report-2023",
    tags: ["Reports", "Achievements", "Transparency"],
  },
  {
    id: 4,
    title: "Organization Recognized for Excellence in Governance",
    excerpt:
      "We are proud to announce that our organization has received an award for excellence in governance and transparency.",
    content: "Full content would go here...",
    date: "2023-09-15",
    author: "Media Relations",
    imageUrl: "/board.png?height=400&width=800",
    slug: "governance-award",
    tags: ["Awards", "Governance", "Recognition"],
  },
  {
    id: 5,
    title: "New Board Members Appointed",
    excerpt:
      "We are pleased to welcome three new members to our Board of Directors, bringing diverse expertise and perspectives.",
    content: "Full content would go here...",
    date: "2023-08-20",
    author: "Board Secretary",
    imageUrl: "/board.png?height=400&width=800",
    slug: "new-board-members",
    tags: ["Board", "Appointments", "Leadership"],
  },
  {
    id: 6,
    title: "Organization Launches New Strategic Plan",
    excerpt:
      "After extensive consultation, we are excited to launch our new five-year strategic plan focusing on sustainable development.",
    content: "Full content would go here...",
    date: "2023-07-05",
    author: "Planning Committee",
    imageUrl: "/board.png?height=400&width=800",
    slug: "strategic-plan-launch",
    tags: ["Strategy", "Planning", "Development"],
  },
]
'use client'

import { useState } from 'react'

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string>("all")

  // Extract all unique tags from blog posts
  const allTags = ["all", ...Array.from(new Set(blogPosts.flatMap((post) => post.tags || [])))]

  // Filter posts based on selected tag
  const filteredPosts = activeTag === "all" ? blogPosts : blogPosts.filter((post) => post.tags?.includes(activeTag))

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Press Releases & News"
        description="Stay updated with the latest announcements, press releases, and news from our organization."
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mt-8 mb-10 justify-center">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag ? "bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

