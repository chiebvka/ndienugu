"use client"

import PageHeader from "@/components/page-header"
import type { GalleryItem } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useMemo } from "react"

// This would typically come from a database or CMS
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Annual General Meeting 2023",
    description: "Members gathered to discuss the organization's achievements and future plans.",
    imageUrl: "/gallery1.jpeg",
    date: "2023-11-15",
    category: "Meetings",
  },
  {
    id: 2,
    title: "Community Outreach Program",
    description: "Our team engaged with local communities to understand their needs better.",
    imageUrl: "/gallery2.jpeg",
    date: "2023-10-05",
    category: "Outreach",
  },
  {
    id: 3,
    title: "Strategic Planning Workshop",
    description: "Board members and staff collaborated on our five-year strategic plan.",
    imageUrl: "/gallery3.jpeg",
    date: "2023-09-22",
    category: "Workshops",
  },
  {
    id: 4,
    title: "Partnership Signing Ceremony",
    description: "Formalizing our collaboration with key stakeholders in the region.",
    imageUrl: "/gallery4.jpeg",
    date: "2023-08-17",
    category: "Partnerships",
  },
  {
    id: 5,
    title: "Quarterly Board Meeting",
    description: "Regular meeting to review progress and address organizational matters.",
    imageUrl: "/gallery4.jpeg",
    date: "2023-07-30",
    category: "Meetings",
  },
  {
    id: 6,
    title: "Staff Development Day",
    description: "Investing in our team through professional development activities.",
    imageUrl: "/gallery5.jpeg",
    date: "2023-06-12",
    category: "Training",
  },
  {
    id: 7,
    title: "Annual Fundraising Gala",
    description: "A successful evening raising funds for our key initiatives.",
    imageUrl: "/gallery6.jpeg",
    date: "2023-05-28",
    category: "Events",
  },
  {
    id: 8,
    title: "Project Launch Event",
    description: "Officially launching our new community development project.",
    imageUrl: "/gallery7.jpeg",
    date: "2023-04-15",
    category: "Projects",
  },
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    const uniqueCategories = new Set(galleryItems.map(item => item.category))
    return ["all", ...Array.from(uniqueCategories)]
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return galleryItems
    return galleryItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Media Gallery"
        description="Browse photos and media from our organization's meetings, events, and activities."
      />

      <div className="max-w-7xl mx-auto">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`capitalize rounded-full hover:bg-[rgb(28,165,94)]/20 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20 ${
                selectedCategory === category 
                  ? "bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-lg bg-black/10 hover:bg-black/0 transition-colors">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View {item.title}</span>
              </Link>
              <div className="relative w-full h-80">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-6 py-4 transition-all duration-300 group-hover:translate-y-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="text-xs bg-[rgb(28,165,94)]/20 text-enugu px-3 py-1 rounded-full font-medium">{item.category}</span>
                </div>
                <p className="text-sm text-white/70 line-clamp-2">{item.description}</p>
                <div className="mt-2 text-xs text-white/70">{new Date(item.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" size="sm">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="ml-4">
            Next
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

