"use client"

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, FileText, Video, Image as ImageIcon } from "lucide-react";

import type { Tables } from "@/types/supabase";
import { toast } from "sonner";

type FeedPost = Tables<"membership_feed">;

interface FeedWizardProps {}

export default function Feedwizard({}: FeedWizardProps) {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For later
    // const [postToDelete, setPostToDelete] = useState<FeedPost | null>(null); // For later
  
    const LIMIT = 5;
  
    const fetchPosts = useCallback(async (pageNum: number, reset = false) => {
      if (loading) return;
      setLoading(true);
      console.log(`Feedwizard: Fetching posts - page: ${pageNum}, reset: ${reset}`);
      try {
        const res = await axios.get(`/api/members/feed/all`, {
          params: { page: pageNum, limit: LIMIT }
        });
        
        console.log("Feedwizard: API Response data:", res.data);

        const { posts: newPosts, total } = res.data;

        if (!Array.isArray(newPosts)) {
          console.error("Feedwizard: API did not return 'posts' as an array.", res.data);
          toast.error("Failed to process posts from server.");
          setPosts(reset ? [] : posts);
          setHasMore(false);
          return;
        }
        
        setPosts(prevPosts => reset ? newPosts : [...prevPosts, ...newPosts]);
        setHasMore((pageNum * LIMIT) < total);
        setPage(pageNum);

      } catch (err: any) {
        console.error("Feedwizard: Failed to fetch posts error:", err);
        if (err.response) {
          console.error("Feedwizard: Error response data:", err.response.data);
          console.error("Feedwizard: Error response status:", err.response.status);
          toast.error(`Failed to fetch posts: ${err.response.data?.error || err.response.statusText || 'Server error'}`);
        } else if (err.request) {
          console.error("Feedwizard: Error request:", err.request);
          toast.error("Failed to fetch posts: No response from server.");
        } else {
          toast.error("Failed to fetch posts: " + (err.message || "Unknown error"));
        }
        if(reset) setPosts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, LIMIT, posts]);
  
    useEffect(() => {
      fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const handleViewMore = () => {
      if (!loading && hasMore) {
        fetchPosts(page + 1);
      }
    };

    if (loading && posts.length === 0) {
      return (
        <div className="container mx-auto py-6 text-center">
          <p>Loading feed...</p>
        </div>
      );
    }

    if (!loading && posts.length === 0 && !hasMore) {
       return (
        <div className="container mx-auto py-6">
           <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Full Member Feed</h1>
           <p className="text-center text-muted-foreground">No posts available in the feed yet.</p>
        </div>
      );
    }

  return (
    // Use container for overall padding, max-width will be handled by individual cards or a wrapper if needed for desktop
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Full Member Feed</h1>
        <div className="space-y-8">
        {posts.map((post) => (
            <Card key={post.id} className="relative hover:shadow-lg border-2 border-enugu transition-shadow overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                    {/* Responsive Author Info and Post Content Wrapper */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Author Info Section - Changes layout on sm screens */}
                        <div className="flex flex-col items-center sm:items-start sm:w-auto sm:flex-shrink-0 text-center sm:text-left mb-4 sm:mb-0">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-0 sm:mr-3">
                                <AvatarFallback>{post.user_email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            {/* On mobile, name and date are below avatar. On desktop, they can be beside or structured differently if needed */}
                             <div className="sm:hidden"> {/* Only show these directly under avatar on mobile */}
                                <p className="font-medium text-md">{post.user_email?.split("@")[0] || 'User'}</p>
                                <p className="text-xs text-muted-foreground">
                                    Uploaded: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Post Content Section - Takes remaining space */}
                        <div className="flex-1 space-y-3 min-w-0"> {/* Added min-w-0 for flex child to allow truncation/wrapping */}
                            {/* User info for desktop - above title */}
                            <div className="hidden sm:flex sm:items-center sm:justify-between mb-1">
                                <p className="font-medium text-md">{post.user_email?.split("@")[0] || 'User'}</p>
                                <p className="text-xs text-muted-foreground">
                                    Uploaded: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                            
                            <h3 className="text-xl lg:text-2xl font-semibold text-center sm:text-left break-words">{post.title || "Untitled Post"}</h3>
                            {post.content && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{post.content}</p>}
                            
                            {post.media_url && (
                                <div className="mt-4 flex flex-col items-center">
                                    {post.content_type === "image" && (
                                    <div className="rounded-lg overflow-hidden w-full max-w-xl mx-auto h-52 bg-muted flex items-center justify-center border">
                                        <img
                                        src={post.media_url}
                                        alt={post.title || "Feed image"}
                                        className="object-contain w-full h-full"
                                        />
                                    </div>
                                    )}
                                    {post.content_type === "video" && (
                                    <div className="rounded-lg overflow-hidden w-full max-w-xl mx-auto h-52 bg-black flex items-center justify-center border">
                                        <video
                                        src={post.media_url}
                                        controls
                                        className="object-contain w-full h-full"
                                        />
                                    </div>
                                    )}
                                    {(post.content_type === "file" || (post.content_type !== "image" && post.content_type !== "video")) && (
                                        <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center gap-3 w-full max-w-xl mx-auto border">
                                            {post.content_type === "video" ? <Video className="h-6 w-6 text-muted-foreground flex-shrink-0" /> : 
                                            post.content_type === "image" ? <ImageIcon className="h-6 w-6 text-muted-foreground flex-shrink-0" /> :
                                            <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" title={post.file_name || "Download file"}>{post.file_name || "Download file"}</p>
                                                {post.file_size_mb && <p className="text-xs text-muted-foreground">{`${post.file_size_mb.toFixed(2)} MB`}</p>}
                                            </div>
                                            <a href={post.media_url} target="_blank" rel="noopener noreferrer" download={post.file_name || true}>
                                                <Button variant="outline" size="sm">Download</Button>
                                            </a>
                                        </div>
                                    )}
                                    { (post.content_type === "image" || post.content_type === "video") && (
                                        <a
                                            href={post.media_url}
                                            download={post.file_name || post.content_type}
                                            className="mt-3"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="link" size="sm" type="button">Download {post.file_name || post.content_type}</Button>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
        {loading && posts.length > 0 && <p className="text-center text-muted-foreground py-4">Loading more posts...</p>}
        {!loading && hasMore && posts.length > 0 && (
            <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={handleViewMore}>
                View More
            </Button>
            </div>
        )}
        {!loading && !hasMore && posts.length > 0 && (
            <p className="text-center text-muted-foreground py-4">You&apos;ve reached the end of the feed.</p>
        )}
        </div>
    </div>
  );
}