"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, ImageIcon } from "lucide-react"

// Sample data - replace with your actual data
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Conference keynote",
    tags: ["event", "conference", "2023"],
  },
  {
    id: 2,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team building",
    tags: ["team", "culture", "2023"],
  },
  {
    id: 3,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product launch",
    tags: ["product", "launch", "2022"],
  },
  {
    id: 4,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Award ceremony",
    tags: ["award", "event", "2023"],
  },
  {
    id: 5,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product demo video",
    tags: ["product", "demo", "2023"],
  },
  {
    id: 6,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Interview with CEO",
    tags: ["interview", "leadership", "2022"],
  },
  {
    id: 7,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Company overview",
    tags: ["company", "overview", "2023"],
  },
  {
    id: 8,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer testimonial",
    tags: ["customer", "testimonial", "2022"],
  },
]

// Get all unique tags
const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))

export default function ModernGridGallery() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))
    return matchesTab && matchesTags
  })

  const imageItems = filteredItems.filter((item) => item.type === "image")
  const videoItems = filteredItems.filter((item) => item.type === "video")

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Organization Gallery</h1>

      {/* Filter Tags */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Filter by Tags:</h2>
        <div className="flex flex-wrap gap-2">
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

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Images Section */}
      {(activeTab === "all" || activeTab === "image") && imageItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <ImageIcon className="mr-2" />
            <h2 className="text-2xl font-semibold">Images</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl"
              >
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{item.alt}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-black/30 hover:bg-black/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {(activeTab === "all" || activeTab === "video") && videoItems.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Play className="mr-2" />
            <h2 className="text-2xl font-semibold">Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative">
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
                <div className="p-4 bg-background">
                  <p className="font-medium">{item.alt}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items match your current filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedTags([])
              setActiveTab("all")
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}

