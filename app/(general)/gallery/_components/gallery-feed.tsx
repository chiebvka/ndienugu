"use client"

import React, { useReducer, useMemo, useCallback, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import Image from "next/image";
import { Calendar, X, ChevronLeft, ChevronRight, Loader2, Image as ImageIconLucide, Video as VideoIconLucide, Tag } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

// --- Types ---
interface ApiTag {
    id: string;
    name: string;
}

// Define the structure of a single gallery image more precisely
interface GalleryImage {
    id: string; // Assuming id is string from Supabase (often UUID)
    image_url: string;
    alt_text: string | null; // alt_text can be null
}

// Updated ApiGalleryItem to match new API response
interface ApiGalleryItem {
    id: string;
    title: string;
    description: string | null;
    date: string;
    mediaType: "image" | "video";
    tags: ApiTag[];
    category: string; // This is 'type' from galleryposts e.g. "Event", "Meeting"
    slug: string;
    galleryImages: GalleryImage[]; // Use the more precise GalleryImage type
    coverImageUrl?: string; // The first image from galleryImages or a dedicated field
}

interface GalleryApiResponse {
  items: ApiGalleryItem[];
  total: number;
}

type Props = {}

// --- Filter State (for frontend filtering) ---
type FilterState = {
  category: string; // e.g., "Event", "Meeting"
  tags: string[];   // Tag names
  year: string;
  }

  type FilterAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_YEAR"; payload: string }
  | { type: "RESET_FILTERS" };

const initialFilterState: FilterState = {
  category: "all",
  tags: [],
  year: "all",
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
      case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "TOGGLE_TAG": {
      const newTags = state.tags.includes(action.payload)
            ? state.tags.filter((tag) => tag !== action.payload)
        : [...state.tags, action.payload];
      return { ...state, tags: newTags };
        }
      case "SET_YEAR":
      return { ...state, year: action.payload };
      case "RESET_FILTERS":
      return initialFilterState;
      default:
      return state;
    }
  }
// --- End Filter State ---

const ITEMS_PER_PAGE = 10;

export default function Galleryfeed({}: Props) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const [allFetchedItems, setAllFetchedItems] = useState<ApiGalleryItem[]>([]); // Store all items fetched so far
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsFromServer, setTotalItemsFromServer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>(["all"]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(["all"]);

  const [selectedItemForLightbox, setSelectedItemForLightbox] = useState<ApiGalleryItem | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0); // Index within selectedItem.galleryImages
  const isMobile = useMobile();


  // --- Data Fetching ---
  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error(`Failed to fetch tags: ${response.statusText}`);
      const tagsData: ApiTag[] = await response.json();
      setAvailableTags(tagsData || []);
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      toast.error("Could not load tags.");
    }
  }, []);

  const fetchGalleryItems = useCallback(async (pageToFetch: number, loadMore = false) => {
    if (loadMore) setIsLoadingMore(true); else setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: pageToFetch.toString(),
      limit: ITEMS_PER_PAGE.toString(),
    });

    try {
      const response = await fetch(`/api/gallery?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }
      const data: GalleryApiResponse = await response.json();

      setAllFetchedItems(prevItems => loadMore ? [...prevItems, ...(data.items || [])] : (data.items || []));
      setTotalItemsFromServer(data.total || 0);
      setCurrentPage(pageToFetch);

      // Derive filters from ALL fetched items
      const currentItems = loadMore ? [...allFetchedItems, ...(data.items || [])] : (data.items || []);
      const uniqueYears = ["all", ...new Set(currentItems.map(item => new Date(item.date).getFullYear().toString()))].sort((a,b) => b.localeCompare(a));
      const uniqueCategories = ["all", ...new Set(currentItems.map(item => item.category))].sort();
      setAvailableYears(uniqueYears);
      setAvailableCategories(uniqueCategories);

    } catch (err: any) {
      console.error("Error fetching gallery items:", err);
      setError(err.message || "Failed to load gallery content.");
      toast.error(err.message || "Failed to load gallery content.");
    } finally {
      if (loadMore) setIsLoadingMore(false); else setIsLoading(false);
    }
  }, [allFetchedItems]); // Add allFetchedItems to dependencies if needed for calculating uniqueYears/Categories based on cumulative data

  useEffect(() => {
    fetchTags();
    fetchGalleryItems(1); // Fetch initial page
  }, [fetchTags]); // Removed fetchGalleryItems from here to avoid loop with allFetchedItems dependency

  const handleLoadMore = () => {
    if (!isLoadingMore && allFetchedItems.length < totalItemsFromServer) {
      fetchGalleryItems(currentPage + 1, true);
    }
  };
  // --- End Data Fetching ---

  // --- Frontend Filtering Logic ---
  const filteredAndDisplayedItems = useMemo(() => {
    return allFetchedItems.filter(item => {
      const matchesYear = filters.year === "all" || new Date(item.date).getFullYear().toString() === filters.year;
      const matchesCategory = filters.category === "all" || item.category === filters.category;
      const matchesTags = filters.tags.length === 0 || filters.tags.every(tagName => item.tags.some(itemTag => itemTag.name === tagName));
      return matchesYear && matchesCategory && matchesTags;
    });
  }, [allFetchedItems, filters]);
  // --- End Frontend Filtering ---


  // --- Event Handlers for Filters ---
  const handleToggleTag = useCallback((tagName: string) => dispatch({ type: "TOGGLE_TAG", payload: tagName }), []);
  const handleResetFilters = useCallback(() => dispatch({ type: "RESET_FILTERS" }), []);
  const handleYearChange = useCallback((year: string) => dispatch({ type: "SET_YEAR", payload: year }), []);
  const handleCategoryChange = useCallback((category: string) => dispatch({ type: "SET_CATEGORY", payload: category }), []);
  // --- End Event Handlers for Filters ---

  // --- Lightbox for Gallery Images ---
  const openImageLightbox = useCallback((item: ApiGalleryItem) => {
    if (item.galleryImages && item.galleryImages.length > 0) {
      setSelectedItemForLightbox(item);
      setLightboxImageIndex(0); // Start with the first image of the selected post
    } else {
      toast.info("This gallery post has no additional images to display.");
    }
  }, []);

  const navigateLightboxCarousel = useCallback((direction: "next" | "prev") => {
    if (!selectedItemForLightbox || !selectedItemForLightbox.galleryImages) return;
    const numImages = selectedItemForLightbox.galleryImages.length;
    if (numImages === 0) return;

    let newIndex = lightboxImageIndex;
      if (direction === "next") {
      newIndex = (lightboxImageIndex + 1) % numImages;
      } else {
      newIndex = (lightboxImageIndex - 1 + numImages) % numImages;
    }
    setLightboxImageIndex(newIndex);
  }, [lightboxImageIndex, selectedItemForLightbox]);

  const closeImageLightbox = useCallback(() => setSelectedItemForLightbox(null), []);
  // --- End Lightbox ---


  // --- Gallery Card Component ---
  const GalleryCard = useCallback(({ item }: { item: ApiGalleryItem }) => {
    const isVideo = item.mediaType === 'video';
    const thumbnailUrl = item.coverImageUrl || (!isVideo ? item.galleryImages?.[0]?.image_url : null);

    return (
      <div
        className="relative group overflow-hidden rounded-lg bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-80 flex flex-col"
        onClick={() => openImageLightbox(item)}
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-400 flex-shrink-0">
          {isVideo ? (
            thumbnailUrl ? (
              <>
                <img
                  src={thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)" />
                    <polygon points="26,20 48,32 26,44" fill="#fff" />
                  </svg>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <div className="flex flex-col items-center">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.2)" />
                    <polygon points="26,20 48,32 26,44" fill="#fff" />
                  </svg>
                  <span className="mt-2 text-gray-600 font-medium text-sm">Video</span>
                </div>
              </div>
            )
          ) : thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
              <ImageIconLucide className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full">
            {isVideo ? <VideoIconLucide className="h-4 w-4" /> : <ImageIconLucide className="h-4 w-4" />}
          </div>
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0">
          <h3 className="text-base sm:text-lg font-semibold truncate text-card-foreground mb-1">{item.title}</h3>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{item.description}</p>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{new Date(item.date).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground capitalize line-clamp-1">Category: {item.category}</p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-auto pt-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map(tag => (
                <Badge key={tag.id} variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }, [openImageLightbox]);
  // --- End Gallery Card ---

  // --- Lightbox/Drawer Content for Multiple Images ---
  const ImageCarouselContent = useCallback(() => {
    if (!selectedItemForLightbox) return null;

    const currentImage = selectedItemForLightbox.galleryImages?.[lightboxImageIndex];
    const isVideo = selectedItemForLightbox.mediaType === 'video';
    const videoUrl = isVideo ? selectedItemForLightbox.galleryImages?.[lightboxImageIndex]?.image_url : null;
    
        return (
          <>
        {isMobile ? (
            <DrawerHeader className="text-left pt-4 pb-2">
                <DrawerTitle className="text-lg font-semibold">{selectedItemForLightbox.title}</DrawerTitle>
                <DrawerDescription className="sr-only">{selectedItemForLightbox.description || 'Gallery item detail'}</DrawerDescription>
            </DrawerHeader>
        ) : (
            <>
              <DialogTitle className="sr-only">{selectedItemForLightbox.title}</DialogTitle>
              <DialogDescription className="sr-only">{selectedItemForLightbox.description || "Gallery item details"}</DialogDescription>
            </>
        )}

        <div className="relative flex-grow flex flex-col overflow-hidden">
            <div className="relative w-full aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
                {isVideo && videoUrl ? (
                  <video
                      key={`${selectedItemForLightbox.id}-${lightboxImageIndex}`}
                      src={videoUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                  >
                      Your browser does not support the video tag.
                  </video>
                ) : !isVideo && currentImage ? (
                  <img
                        key={currentImage.id}
                        src={currentImage.image_url}
                        alt={currentImage.alt_text || selectedItemForLightbox.title}
                    
                    className="object-contain"
                  />
                ) : (
                    <div className="text-white flex flex-col items-center justify-center h-full">
                        {isVideo ? <VideoIconLucide className="h-16 w-16 mb-2" /> : <ImageIconLucide className="h-16 w-16 mb-2" />}
                        <span>{isVideo ? "Video not available." : (selectedItemForLightbox.galleryImages?.length === 0 ? "No preview images for this item." : "Image not available")}</span>
                    </div>
                )}
              </div>
    
            {selectedItemForLightbox.galleryImages && selectedItemForLightbox.galleryImages.length > 1 && (
                <>
              <Button
                variant="ghost"
                size="icon"
                        className="absolute left-1 sm:left-2 top-[calc(50%-5rem)] md:top-1/2 transform -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 h-10 w-10"
                        onClick={() => navigateLightboxCarousel("prev")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                        className="absolute right-1 sm:right-2 top-[calc(50%-5rem)] md:top-1/2 transform -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 h-10 w-10"
                        onClick={() => navigateLightboxCarousel("next")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md z-20">
                        {lightboxImageIndex + 1} / {selectedItemForLightbox.galleryImages.length}
            </div>
                </>
            )}

            <div className={`p-4 ${isMobile ? 'max-h-[calc(100vh-56px-240px-60px)]' : 'max-h-[calc(90vh-240px)]'} overflow-y-auto`}>
                {!isMobile && (
                    <h2 className="text-xl font-semibold mb-2 text-foreground">{selectedItemForLightbox.title}</h2>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{new Date(selectedItemForLightbox.date).toLocaleDateString()}</span>
                    <Badge variant="outline" className="capitalize">{selectedItemForLightbox.category}</Badge>
              </div>
                {selectedItemForLightbox.description && (
                    <p className="text-sm text-foreground mb-3">{selectedItemForLightbox.description}</p>
                )}
                {selectedItemForLightbox.tags && selectedItemForLightbox.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedItemForLightbox.tags.map((tag) => (
                            <Badge key={tag.id} className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 px-2 py-0.5 text-xs">
                                {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
        </div>
        
        {!isMobile && (
            <DialogClose className="absolute right-2 top-2 z-20 rounded-full bg-background/80 p-1.5 opacity-70 hover:opacity-100">
                <X className="h-5 w-5" /> <span className="sr-only">Close</span>
            </DialogClose>
        )}
      </>
    );
  }, [selectedItemForLightbox, lightboxImageIndex, navigateLightboxCarousel, isMobile]);
  // --- End Lightbox/Drawer ---

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Controls - Adjusted Layout */}
      <div className="mb-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
    <div>
                <label htmlFor="year-filter" className="block text-sm font-medium text-muted-foreground mb-1">Year</label>
                <Select value={filters.year} onValueChange={handleYearChange}>
                    <SelectTrigger id="year-filter"><SelectValue placeholder="All Years" /></SelectTrigger>
                    <SelectContent>{availableYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <Select value={filters.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category-filter"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>{availableCategories.map(cat => <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>)}</SelectContent>
            </Select>
            </div>
            {(filters.year !== "all" || filters.category !== "all" || filters.tags.length > 0) && (
                <div className="lg:col-start-4 flex justify-end"> {/* Position reset button */}
                    <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">Reset Filters</Button>
                </div>
            )}
          </div>

        {availableTags.length > 0 && (
          <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Filter by Tags:</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-background">
                    {availableTags.map(tag => (
                <Badge
                            key={tag.id}
                            variant={filters.tags.includes(tag.name) ? "default" : "outline"}
                            onClick={() => handleToggleTag(tag.name)}
                            className={`cursor-pointer transition-colors ${filters.tags.includes(tag.name) ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-muted/50'}`}
                        >
                            {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
         {/* Showing X items description */}
        {!isLoading && !error && (
             <p className="text-sm text-muted-foreground">Showing {filteredAndDisplayedItems.length} item{filteredAndDisplayedItems.length === 1 ? "" : "s"}</p>
        )}
      </div>


      {/* Gallery Display */}
      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">Loading Media...</span></div>}
      {!isLoading && error && <div className="text-center py-12 text-destructive"><p>{error}</p><Button variant="outline" onClick={() => fetchGalleryItems(1)} className="mt-4">Try Again</Button></div>}
      {!isLoading && !error && filteredAndDisplayedItems.length === 0 && (
        <div className="text-center py-12"><p className="text-muted-foreground">No media items match your filters.</p></div>
      )}

      {!isLoading && !error && filteredAndDisplayedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredAndDisplayedItems.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && !error && allFetchedItems.length < totalItemsFromServer && (
        <div className="mt-12 text-center">
          <Button onClick={handleLoadMore} disabled={isLoadingMore} variant="outline">
            {isLoadingMore ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "View More"}
          </Button>
                </div>
              )}

      {/* Lightbox/Drawer for Image Carousel */}
      {isMobile ? (
        <Drawer open={!!selectedItemForLightbox} onClose={closeImageLightbox} direction="bottom">
          <DrawerContent className="max-h-[95vh] flex flex-col p-0 bg-background"> {/* Ensure bg for drawer */}
            <ImageCarouselContent />
            <DrawerFooter className="pt-2 pb-4 border-t">
                <Button variant="outline" onClick={closeImageLightbox} className="w-full">Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedItemForLightbox} onOpenChange={(open) => !open && closeImageLightbox()}>
          <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] w-full p-0 overflow-hidden bg-background shadow-2xl rounded-lg max-h-[90vh] flex flex-col">
            <ImageCarouselContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
  }