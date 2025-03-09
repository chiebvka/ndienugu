"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, ImageIcon, Calendar, Tag } from "lucide-react"

// Sample data - replace with your actual data
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Annual conference keynote",
    date: "May 15, 2023",
    tags: ["event", "conference", "2023"],
  },
  {
    id: 2,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team building retreat",
    date: "April 3, 2023",
    tags: ["team", "culture", "2023"],
  },
  {
    id: 3,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product launch event",
    date: "November 12, 2022",
    tags: ["product", "launch", "2022"],
  },
  {
    id: 4,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Award ceremony",
    date: "December 5, 2022",
    tags: ["award", "event", "2022"],
  },
  {
    id: 5,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product demo video",
    date: "June 20, 2023",
    tags: ["product", "demo", "2023"],
  },
  {
    id: 6,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Interview with CEO",
    date: "October 8, 2022",
    tags: ["interview", "leadership", "2022"],
  },
  {
    id: 7,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Company overview",
    date: "January 15, 2023",
    tags: ["company", "overview", "2023"],
  },
  {
    id: 8,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer testimonial",
    date: "September 30, 2022",
    tags: ["customer", "testimonial", "2022"],
  },
]

// Get all unique tags
const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))
  .filter((tag) => !/^\d{4}$/.test(tag))
  .sort()

// Get years for timeline
const years = Array.from(new Set(galleryItems.flatMap((item) => item.tags.filter((tag) => /^\d{4}$/.test(tag)))))
  .sort()
  .reverse()

export default function TimelineGallery() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeYear, setActiveYear] = useState<string>(years[0] || "2023")

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchesYear = item.tags.includes(activeYear)
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))
    return matchesYear && matchesTags
  })

  const imageItems = filteredItems.filter((item) => item.type === "image")
  const videoItems = filteredItems.filter((item) => item.type === "video")

  // Sort items by date (newest first)
  const sortedImageItems = [...imageItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const sortedVideoItems = [...videoItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Organization Timeline</h1>

      {/* Year Timeline */}
      <div className="flex justify-center mb-8 overflow-x-auto py-4">
        <div className="flex space-x-1">
          {years.map((year) => (
            <Button
              key={year}
              variant={activeYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveYear(year)}
              className="rounded-full"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {/* Tag Filters */}
      <div className="mb-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4" />
          <h2 className="text-lg font-medium">Filter by Tags:</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="text-xs">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Images Section */}
      {imageItems.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <ImageIcon className="mr-2" />
            <h2 className="text-2xl font-semibold">Images</h2>
          </div>
          <div className="relative border-l-2 border-muted-foreground/20 pl-6 ml-6">
            {sortedImageItems.map((item, index) => (
              <div key={item.id} className="mb-12 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col">
                    <time className="text-sm text-muted-foreground mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </time>
                    <h3 className="text-lg font-medium mb-2">{item.alt}</h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags
                        .filter((tag) => tag !== activeYear)
                        .map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.alt}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-12" />

      {/* Videos Section */}
      {videoItems.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Play className="mr-2" />
            <h2 className="text-2xl font-semibold">Videos</h2>
          </div>
          <div className="relative border-l-2 border-muted-foreground/20 pl-6 ml-6">
            {sortedVideoItems.map((item, index) => (
              <div key={item.id} className="mb-12 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col">
                    <time className="text-sm text-muted-foreground mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </time>
                    <h3 className="text-lg font-medium mb-2">{item.alt}</h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags
                        .filter((tag) => tag !== activeYear)
                        .map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="relative overflow-hidden rounded-lg shadow-md group">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.alt}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover brightness-90 transition-all group-hover:brightness-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
                          <Play className="h-8 w-8 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items match your current filters for {activeYear}.</p>
          <Button variant="outline" className="mt-4" onClick={() => setSelectedTags([])}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}

