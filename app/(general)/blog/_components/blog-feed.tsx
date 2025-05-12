"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BlogPostCard from "@/components/blog-post-card";
import TagFilter from "@/components/ui/tag-filter";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// --- Types (matching the API response) ---
interface ApiTag {
    id: string;
    name: string;
}

interface ApiBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    created_at: string;
    author_name: string | null;
    tags: ApiTag[];
}

interface BlogApiResponse {
    items: ApiBlogPost[];
    total: number;
}
// --- End Types ---

const ITEMS_PER_PAGE = 10; // Or your preferred number

export default function Blogfeed() {
    const [allFetchedPosts, setAllFetchedPosts] = useState<ApiBlogPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPostsFromServer, setTotalPostsFromServer] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // Store names of selected tags
    const [isLoadingTags, setIsLoadingTags] = useState(true);

    // Fetch all available tags (can be shared with gallery or be blog-specific)
    const fetchAllTags = useCallback(async () => {
        setIsLoadingTags(true);
        try {
            const response = await fetch("/api/tags"); // Assuming shared tags endpoint
            if (!response.ok) throw new Error("Failed to fetch tags");
            const tagsData: ApiTag[] = await response.json();
            setAvailableTags(tagsData || []);
        } catch (err: any) {
            toast.error(err.message || "Could not load tags.");
            setAvailableTags([]);
        } finally {
            setIsLoadingTags(false);
        }
    }, []);

    // Fetch blog posts
    const fetchBlogPosts = useCallback(async (pageToFetch: number, loadMore = false) => {
        if (loadMore) setIsLoadingMore(true); else setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({
            page: pageToFetch.toString(),
            limit: ITEMS_PER_PAGE.toString(),
        });

        try {
            const response = await fetch(`/api/blog?${params.toString()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.statusText}`);
            }
            const data: BlogApiResponse = await response.json();

            setAllFetchedPosts(prevPosts => loadMore ? [...prevPosts, ...(data.items || [])] : (data.items || []));
            setTotalPostsFromServer(data.total || 0);
            setCurrentPage(pageToFetch);
        } catch (err: any)
        {
            console.error("Error fetching blog posts:", err);
            setError(err.message || "Failed to load blog posts.");
            toast.error(err.message || "Failed to load blog posts.");
        } finally {
            if (loadMore) setIsLoadingMore(false); else setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllTags();
        fetchBlogPosts(1); // Fetch initial page
    }, [fetchAllTags]); // Removed fetchBlogPosts to avoid loop with allFetchedPosts dependency

    const handleLoadMore = () => {
        if (!isLoadingMore && allFetchedPosts.length < totalPostsFromServer) {
            fetchBlogPosts(currentPage + 1, true);
        }
    };

    const handleToggleTag = (tagName: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tagName)
                ? prevTags.filter(t => t !== tagName)
                : [...prevTags, tagName]
        );
    };

    // Client-side filtering
    const filteredPosts = useMemo(() => {
        if (selectedTags.length === 0) {
            return allFetchedPosts;
        }
        return allFetchedPosts.filter(post =>
            selectedTags.every(selectedTag =>
                post.tags.some(postTag => postTag.name === selectedTag)
            )
        );
    }, [allFetchedPosts, selectedTags]);

  return (
        <div className="py-8">
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-center sm:text-left">Filter by Tags</h2>
                <TagFilter
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    loading={isLoadingTags}
                />
            </div>

            {isLoading && filteredPosts.length === 0 && ( // Show main loader only on initial load
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <span className="ml-3 text-lg">Loading Posts...</span>
                </div>
            )}

            {!isLoading && error && (
                <div className="text-center py-12 text-destructive">
                    <p className="text-lg mb-2">{error}</p>
                    <Button variant="outline" onClick={() => fetchBlogPosts(1)}>Try Again</Button>
                </div>
            )}

            {!isLoading && !error && filteredPosts.length === 0 && allFetchedPosts.length > 0 && (
                 <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No posts match your selected tags.</p>
                    {selectedTags.length > 0 && (
                        <Button variant="link" onClick={() => setSelectedTags([])} className="mt-2">Clear Tag Filters</Button>
                    )}
                </div>
            )}
             {!isLoading && !error && filteredPosts.length === 0 && allFetchedPosts.length === 0 && (
                 <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No blog posts available at the moment.</p>
        </div>
            )}


            {filteredPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
            )}

            {!isLoading && !error && allFetchedPosts.length > 0 && allFetchedPosts.length < totalPostsFromServer && (
                <div className="mt-12 text-center">
                    <Button onClick={handleLoadMore} disabled={isLoadingMore} variant="outline" size="lg">
                        {isLoadingMore ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading More...</> : "View More Posts"}
                    </Button>
                </div>
            )}
        </div>
    );
}