'use client'

import PageHeader from "@/components/page-header"
import Blogfeed from "./_components/blog-feed"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Press Releases & News"
        description="Stay updated with the latest announcements, press releases, and news from our organization."
      />
      <div className="max-w-7xl mx-auto">
        <Blogfeed />
      </div>
    </div>
  )
}

