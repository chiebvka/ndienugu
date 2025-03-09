"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, ImageIcon, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data - replace with your actual data
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/placeholder.svg?height=600&width=800",
    alt: "Annual conference keynote",
    featured: true,
    tags: ["event", "conference", "2023"],
  },
  {
    id: 2,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team building retreat",
    featured: false,
    tags: ["team", "culture", "2023"],
  },
  {
    id: 3,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product launch event",
    featured: false,
    tags: ["product", "launch", "2022"],
  },
  {
    id: 4,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Award ceremony",
    featured: false,
    tags: ["award", "event", "2023"],
  },
  {
    id: 5,
    type: "video",
    src: "/placeholder.svg?height=600&width=800",
    alt: "Product demo video",
    featured: true,
    tags: ["product", "demo", "2023"],
  },
  {
    id: 6,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Interview with CEO",
    featured: false,
    tags: ["interview", "leadership", "2022"],
  },
  {
    id: 7,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Company overview",
    featured: false,
    tags: ["company", "overview", "2023"],
  },
  {
    id: 8,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer testimonial",
    featured: false,
    tags: ["customer", "testimonial", "2022"],
  },
]

// Get all unique tags
const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))
const years = Array.from(new Set(allTags.filter((tag) => /^\d{4}$/.test(tag))))

export default function MagazineStyleGallery() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"all" | "images" | "videos">("all")

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchesType =
      viewMode === "all" ||
      (viewMode === "images" && item.type === "image") ||
      (viewMode === "videos" && item.type === "video")

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))

    const matchesYear = selectedYear === "all" || item.tags.includes(selectedYear)

    return matchesType && matchesTags && matchesYear
  })

  const featuredItems = filteredItems.filter((item) => item.featured)
  const regularItems = filteredItems.filter((item) => !item.featured)

  const imageItems = filteredItems.filter((item) => item.type === "image")
  const videoItems = filteredItems.filter((item) => item.type === "video")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Media Gallery</h1>

        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as "all" | "images" | "videos")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="images">Images Only</SelectItem>
              <SelectItem value="videos">Videos Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Gallery</SheetTitle>
                <SheetDescription>Select tags to filter the gallery content</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {allTags
                    .filter((tag) => !/^\d{4}$/.test(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                    Clear filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 inline-block border-b-2 border-primary pb-1">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <div className="relative">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    width={800}
                    height={600}
                    className="w-full h-[400px] object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play className="h-10 w-10 text-white" fill="white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  </div>
                </div>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-semibold mb-2">{item.alt}</h3>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
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

      {/* Images Section */}
      {(viewMode === "all" || viewMode === "images") && imageItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <ImageIcon className="mr-2" />
            <h2 className="text-2xl font-semibold">Photography</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imageItems
              .filter((item) => !item.featured)
              .map((item) => (
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

      <Separator className="my-12" />

      {/* Videos Section */}
      {(viewMode === "all" || viewMode === "videos") && videoItems.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Play className="mr-2" />
            <h2 className="text-2xl font-semibold">Video Content</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoItems
              .filter((item) => !item.featured)
              .map((item) => (
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
              setSelectedYear("all")
              setViewMode("all")
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}

