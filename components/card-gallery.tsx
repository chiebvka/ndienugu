"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, ImageIcon, X, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMobile } from "@/hooks/use-mobile"

// Sample data - replace with your actual data
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Annual conference keynote",
    description: "Our CEO delivering the keynote speech at the annual industry conference.",
    tags: ["event", "conference", "2023"],
  },
  {
    id: 2,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team building retreat",
    description: "The marketing team during our quarterly team building retreat in the mountains.",
    tags: ["team", "culture", "2023"],
  },
  {
    id: 3,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product launch event",
    description: "Unveiling our latest product at the tech expo with industry partners.",
    tags: ["product", "launch", "2022"],
  },
  {
    id: 4,
    type: "image",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Award ceremony",
    description: "Receiving the industry innovation award for our groundbreaking technology.",
    tags: ["award", "event", "2023"],
  },
  {
    id: 5,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Product demo video",
    description: "A comprehensive demonstration of our flagship product features and benefits.",
    tags: ["product", "demo", "2023"],
  },
  {
    id: 6,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Interview with CEO",
    description: "An exclusive interview with our CEO discussing the company vision and future plans.",
    tags: ["interview", "leadership", "2022"],
  },
  {
    id: 7,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Company overview",
    description: "A brief overview of our company history, mission, and core values.",
    tags: ["company", "overview", "2023"],
  },
  {
    id: 8,
    type: "video",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer testimonial",
    description: "One of our valued customers sharing their experience with our products and services.",
    tags: ["customer", "testimonial", "2022"],
  },
]

// Get all unique tags
const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))
  .filter((tag) => !/^\d{4}$/.test(tag))
  .sort()

// Get years
const years = Array.from(new Set(galleryItems.flatMap((item) => item.tags.filter((tag) => /^\d{4}$/.test(tag)))))
  .sort()
  .reverse()

export default function CardGallery() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number>(0)
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchesYear = selectedYear === "all" || item.tags.includes(selectedYear)
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))
    return matchesYear && matchesTags
  })

  const imageItems = filteredItems.filter((item) => item.type === "image")
  const videoItems = filteredItems.filter((item) => item.type === "video")

  const openLightbox = (item: (typeof galleryItems)[0]) => {
    setSelectedItem(item)
    const index = filteredItems.findIndex((i) => i.id === item.id)
    setLightboxIndex(index)
  }

  const navigateLightbox = (direction: "next" | "prev") => {
    if (!selectedItem) return

    let newIndex = lightboxIndex
    if (direction === "next") {
      newIndex = (lightboxIndex + 1) % filteredItems.length
    } else {
      newIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
    }

    setLightboxIndex(newIndex)
    setSelectedItem(filteredItems[newIndex])
  }

  const FilterComponent = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Filter by Year:</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedYear === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedYear("all")}
          >
            All Years
          </Badge>
          {years.map((year) => (
            <Badge
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Tags:</h3>
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
        </div>
      </div>

      {(selectedTags.length > 0 || selectedYear !== "all") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedTags([])
            setSelectedYear("all")
          }}
          className="mt-4"
        >
          Reset all filters
        </Button>
      )}
    </>
  )

  return (
    <div className="container mx-auto px-4 py-12" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Media Collection</h1>

        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter Gallery</DrawerTitle>
                <DrawerDescription>Apply filters to find specific content</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2">
                <FilterComponent />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Gallery</DialogTitle>
                <DialogDescription>Apply filters to find specific content</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FilterComponent />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Images Section */}
      {imageItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <ImageIcon className="mr-2" />
            <h2 className="text-2xl font-semibold">Images</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {imageItems.map((item) => (
              <div
                key={item.id}
                className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{item.alt}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
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

      <Separator className="my-12" />

      {/* Videos Section */}
      {videoItems.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Play className="mr-2" />
            <h2 className="text-2xl font-semibold">Videos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoItems.map((item) => (
              <div
                key={item.id}
                className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover brightness-90 transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-125">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{item.alt}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
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

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items match your current filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedTags([])
              setSelectedYear("all")
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* Lightbox Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
            <div className="relative">
              <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-1">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>

              <div className="relative aspect-video">
                <Image
                  src={selectedItem.src || "/placeholder.svg"}
                  alt={selectedItem.alt}
                  fill
                  className="object-contain"
                />
                {selectedItem.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                      <Play className="h-10 w-10 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                onClick={() => navigateLightbox("prev")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                onClick={() => navigateLightbox("next")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{selectedItem.alt}</h2>
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

