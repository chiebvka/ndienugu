"use client"

import type React from "react"

import { useReducer, useMemo, useCallback, useState } from "react"
import PageHeader from "@/components/page-header"
import type { GalleryItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from "@/components/ui/drawer"
import Image from "next/image"
import { Play, ImageIcon, Search, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// Extended GalleryItem type to include mediaType and videoUrl
interface EnhancedGalleryItem extends GalleryItem {
  mediaType: "image" | "video"
  tags?: string[]
  videoUrl?: string
}

// This would typically come from a database or CMS
const galleryItems: EnhancedGalleryItem[] = [
  {
    id: 1,
    title: "Annual General Meeting 2023",
    description: "Members gathered to discuss the organization's achievements and future plans.",
    imageUrl: "/gallery1.jpeg",
    date: "2023-11-15",
    category: "Meetings",
    mediaType: "image",
    tags: ["meeting", "annual", "members"],
  },
  {
    id: 2,
    title: "Community Outreach Program",
    description: "Our team engaged with local communities to understand their needs better.",
    imageUrl: "/gallery2.jpeg",
    date: "2023-10-05",
    category: "Outreach",
    mediaType: "image",
    tags: ["community", "outreach", "engagement"],
  },
  {
    id: 3,
    title: "Strategic Planning Workshop",
    description: "Board members and staff collaborated on our five-year strategic plan.",
    imageUrl: "/gallery3.jpeg",
    date: "2023-09-22",
    category: "Workshops",
    mediaType: "image",
    tags: ["planning", "strategy", "workshop"],
  },
  {
    id: 4,
    title: "Partnership Signing Ceremony",
    description: "Formalizing our collaboration with key stakeholders in the region.",
    imageUrl: "/gallery4.jpeg",
    date: "2023-08-17",
    category: "Partnerships",
    mediaType: "image",
    tags: ["partnership", "ceremony", "collaboration"],
  },
  {
    id: 5,
    title: "Quarterly Board Meeting",
    description: "Regular meeting to review progress and address organizational matters.",
    imageUrl: "/gallery4.jpeg",
    date: "2023-07-30",
    category: "Meetings",
    mediaType: "image",
    tags: ["meeting", "board", "quarterly"],
  },
  {
    id: 6,
    title: "Staff Development Day",
    description: "Investing in our team through professional development activities.",
    imageUrl: "/gallery5.jpeg",
    date: "2023-06-12",
    category: "Training",
    mediaType: "image",
    tags: ["staff", "development", "training"],
  },
  {
    id: 7,
    title: "Annual Fundraising Gala",
    description: "A successful evening raising funds for our key initiatives.",
    imageUrl: "/gallery7.jpeg", // Thumbnail for video
    videoUrl: "https://yv78tqrpgx.ufs.sh/f/6zG49qUG7aw32UHmiKJGpuJeSib0A7zCkKjBHYr6UMhf8oXx",
    date: "2023-05-28",
    category: "Events",
    mediaType: "video",
    tags: ["fundraising", "gala", "event"],
  },
  {
    id: 8,
    title: "Project Launch Event",
    description: "Officially launching our new community development project.",
    imageUrl: "/gallery7.jpeg", // Thumbnail for video
    videoUrl: "https://yv78tqrpgx.ufs.sh/f/6zG49qUG7aw32UHmiKJGpuJeSib0A7zCkKjBHYr6UMhf8oXx",
    date: "2023-04-15",
    category: "Projects",
    mediaType: "video",
    tags: ["project", "launch", "event"],
  },
  {
    id: 9,
    title: "Community Health Workshop",
    description: "Educational workshop on health and wellness for community members.",
    imageUrl: "/gallery5.jpeg", // Thumbnail for video
    videoUrl: "https://yv78tqrpgx.ufs.sh/f/6zG49qUG7aw32UHmiKJGpuJeSib0A7zCkKjBHYr6UMhf8oXx",
    date: "2023-03-20",
    category: "Workshops",
    mediaType: "video",
    tags: ["health", "workshop", "community"],
  },
  {
    id: 10,
    title: "Volunteer Appreciation Day",
    description: "Celebrating the dedication and hard work of our volunteers.",
    imageUrl: "/gallery6.jpeg", // Thumbnail for video
    videoUrl: "https://yv78tqrpgx.ufs.sh/f/6zG49qUG7aw32UHmiKJGpuJeSib0A7zCkKjBHYr6UMhf8oXx",
    date: "2023-02-15",
    category: "Events",
    mediaType: "video",
    tags: ["volunteer", "appreciation", "celebration"],
  },
]

// Extract metadata once at module level
const CATEGORIES = (() => {
  const uniqueCategories = new Set(galleryItems.map((item) => item.category))
  return ["all", ...Array.from(uniqueCategories)]
})()

const TAGS = (() => {
  const tags = new Set<string>()
  galleryItems.forEach((item) => {
    item.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
})()

const YEARS = (() => {
  const uniqueYears = new Set(galleryItems.map((item) => new Date(item.date).getFullYear().toString()))
  return ["all", ...Array.from(uniqueYears).sort().reverse()]
})()

// Define filter state and actions
type FilterState = {
  activeTab: string
  category: string
  tags: string[]
  year: string
  search: string
  page: number
}

type FilterAction =
  | { type: "SET_TAB"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_YEAR"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_FILTERS" }

const initialFilterState: FilterState = {
  activeTab: "all",
  category: "all",
  tags: [],
  year: "all",
  search: "",
  page: 1,
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.payload, page: 1 }
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 }
    case "TOGGLE_TAG":
      return {
        ...state,
        tags: state.tags.includes(action.payload)
          ? state.tags.filter((tag) => tag !== action.payload)
          : [...state.tags, action.payload],
        page: 1,
      }
    case "SET_YEAR":
      return { ...state, year: action.payload, page: 1 }
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 }
    case "SET_PAGE":
      return { ...state, page: action.payload }
    case "RESET_FILTERS":
      return initialFilterState
    default:
      return state
  }
}

export default function GalleryPage() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState)
  const [selectedItem, setSelectedItem] = useState<EnhancedGalleryItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number>(0)
  const isMobile = useMobile()
  const itemsPerPage = 8

  // Filter items based on all criteria
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      // Filter by media type (tab)
      const matchesTab =
        filters.activeTab === "all" ||
        (filters.activeTab === "images" && item.mediaType === "image") ||
        (filters.activeTab === "videos" && item.mediaType === "video")

      // Filter by category
      const matchesCategory = filters.category === "all" || item.category === filters.category

      // Filter by tags
      const matchesTags = filters.tags.length === 0 || filters.tags.some((tag) => item.tags?.includes(tag))

      // Filter by year
      const itemYear = new Date(item.date).getFullYear().toString()
      const matchesYear = filters.year === "all" || itemYear === filters.year

      // Filter by search query
      const matchesSearch =
        filters.search === "" ||
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())

      return matchesTab && matchesCategory && matchesTags && matchesYear && matchesSearch
    })
  }, [filters])

  // Separate items by media type
  const imageItems = useMemo(() => filteredItems.filter((item) => item.mediaType === "image"), [filteredItems])

  const videoItems = useMemo(() => filteredItems.filter((item) => item.mediaType === "video"), [filteredItems])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const paginatedItems = useMemo(() => {
    const startIndex = (filters.page - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredItems, filters.page])

  // Event handlers
  const handleToggleTag = useCallback((tag: string) => {
    dispatch({ type: "TOGGLE_TAG", payload: tag })
  }, [])

  const handleResetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" })
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH", payload: e.target.value })
  }, [])

  const openLightbox = useCallback(
    (item: EnhancedGalleryItem) => {
      setSelectedItem(item)
      const index = filteredItems.findIndex((i) => i.id === item.id)
      setLightboxIndex(index)
    },
    [filteredItems],
  )

  const navigateLightbox = useCallback(
    (direction: "next" | "prev") => {
      if (!selectedItem) return

      let newIndex = lightboxIndex
      if (direction === "next") {
        newIndex = (lightboxIndex + 1) % filteredItems.length
      } else {
        newIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      }

      setLightboxIndex(newIndex)
      setSelectedItem(filteredItems[newIndex])
    },
    [filteredItems, lightboxIndex, selectedItem],
  )

  const closeLightbox = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.tags.length > 0 ||
    filters.year !== "all" ||
    filters.search ||
    filters.activeTab !== "all"

  // Gallery item component to reduce repetition
  const GalleryCard = useCallback(
    ({ item }: { item: EnhancedGalleryItem }) => (
      <div
        className="relative group overflow-hidden rounded-lg bg-black/10 hover:bg-black/0 transition-colors cursor-pointer"
        onClick={() => openLightbox(item)}
      >
        <div className="relative w-full h-80">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
              item.mediaType === "video" ? "brightness-90" : ""
            }`}
            style={{ objectFit: "cover" }}
          />
          {item.mediaType === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-6 py-4 transition-all duration-300 group-hover:translate-y-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <span className="text-xs bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] px-3 py-1 rounded-full font-medium">
              {item.category}
            </span>
          </div>
          <p className="text-sm text-white/70 line-clamp-2">{item.description}</p>
          <div className="mt-2 text-xs text-white/70">{new Date(item.date).toLocaleDateString()}</div>
          {item.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    [openLightbox],
  )

  // Lightbox content component
  const LightboxContent = useCallback(() => {
    if (!selectedItem) return null

    return (
      <>
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-1">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="relative aspect-video">
            {selectedItem.mediaType === "video" ? (
              <video
                src={selectedItem.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
                poster={selectedItem.imageUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={selectedItem.imageUrl || "/placeholder.svg"}
                alt={selectedItem.title}
                fill
                className="object-contain"
              />
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
          <h2 className="text-xl font-semibold mb-2">{selectedItem.title}</h2>
          <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{new Date(selectedItem.date).toLocaleDateString()}</span>
            <span className="text-xs bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] px-3 py-1 rounded-full font-medium">
              {selectedItem.category}
            </span>
          </div>
          {selectedItem.tags && (
            <div className="flex flex-wrap gap-1">
              {selectedItem.tags.map((tag) => (
                <Badge key={tag} className="bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }, [selectedItem, navigateLightbox])

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Media Gallery"
        description="Browse photos and videos from our organization's meetings, events, and activities."
      />

      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          {/* <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gallery..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div> */}

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Media Type Tabs */}
            {/* <Tabs
              value={filters.activeTab}
              onValueChange={(value) => dispatch({ type: "SET_TAB", payload: value })}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Media</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>
            </Tabs> */}

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.year} onValueChange={(value) => dispatch({ type: "SET_YEAR", payload: value })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => dispatch({ type: "SET_CATEGORY", payload: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="ml-auto">
                Reset Filters
              </Button>
            )}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer capitalize hover:bg-[rgb(28,165,94)]/20 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20 ${
                    filters.tags.includes(tag)
                      ? "bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]"
                      : ""
                  }`}
                  onClick={() => handleToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filter Summary */}
          {filteredItems.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
              {filters.category !== "all" && ` in ${filters.category}`}
              {filters.year !== "all" && ` from ${filters.year}`}
              {filters.search && ` matching "${filters.search}"`}
            </p>
          )}
        </div>

        {/* Images Section */}
        {(filters.activeTab === "all" || filters.activeTab === "images") && imageItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <ImageIcon className="mr-2" />
              <h2 className="text-2xl font-semibold">Images</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(filters.activeTab === "all"
                ? imageItems.slice(0, 4)
                : paginatedItems.filter((item) => item.mediaType === "image")
              ).map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
            {filters.activeTab === "all" && imageItems.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch({ type: "SET_TAB", payload: "images" })}
                  className="hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
                >
                  View All Images ({imageItems.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Videos Section */}
        {(filters.activeTab === "all" || filters.activeTab === "videos") && videoItems.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <Play className="mr-2" />
              <h2 className="text-2xl font-semibold">Videos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(filters.activeTab === "all"
                ? videoItems.slice(0, 4)
                : paginatedItems.filter((item) => item.mediaType === "video")
              ).map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
            {filters.activeTab === "all" && videoItems.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch({ type: "SET_TAB", payload: "videos" })}
                  className="hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
                >
                  View All Videos ({videoItems.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No items match your current filters.</p>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filters.activeTab !== "all" && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "SET_PAGE", payload: Math.max(filters.page - 1, 1) })}
              disabled={filters.page === 1}
              className="hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={filters.page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch({ type: "SET_PAGE", payload: page })}
                  className={`w-8 h-8 p-0 ${
                    filters.page === page
                      ? "bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]"
                      : "hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "SET_PAGE", payload: Math.min(filters.page + 1, totalPages) })}
              disabled={filters.page === totalPages}
              className="hover:bg-[rgb(28,165,94)]/10 hover:text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox for desktop */}
      {!isMobile && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && closeLightbox()}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
            <DialogTitle className="sr-only">
              {selectedItem?.title || 'Gallery Item'}
            </DialogTitle>
            <LightboxContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer open={!!selectedItem} onOpenChange={(open) => !open && closeLightbox()}>
          <DrawerContent className="p-0">
            <div className="relative aspect-video">
              {selectedItem?.mediaType === "video" ? (
                <video
                  src={selectedItem.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full"
                  poster={selectedItem.imageUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={selectedItem?.imageUrl || "/placeholder.svg"}
                  alt={selectedItem?.title || ""}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{selectedItem?.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedItem?.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {selectedItem && new Date(selectedItem.date).toLocaleDateString()}
                </span>
                <span className="text-xs bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] px-3 py-1 rounded-full font-medium">
                  {selectedItem?.category}
                </span>
              </div>
              {selectedItem?.tags && (
                <div className="flex flex-wrap gap-1">
                  {selectedItem.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[rgb(28,165,94)]/20 text-[rgb(28,165,94)] border-[rgb(28,165,94)]/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
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

