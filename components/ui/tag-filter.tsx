"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";

interface Tag {
    id: string;
    name: string;
}

interface TagFilterProps {
    availableTags: Tag[];
    selectedTags: string[]; // Array of selected tag names
    onToggleTag: (tagName: string) => void;
    loading?: boolean;
}

export default function TagFilter({ availableTags, selectedTags, onToggleTag, loading }: TagFilterProps) {
    if (loading) {
        return (
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-muted animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <Badge key={i} className="h-7 w-20 opacity-50" />
                ))}
            </div>
        );
    }

    if (!availableTags || availableTags.length === 0) {
        return <p className="text-sm text-muted-foreground">No tags available for filtering.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-background">
            {availableTags.map((tag) => (
                <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    onClick={() => onToggleTag(tag.name)}
                    className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag.name) 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    {tag.name}
                </Badge>
            ))}
        </div>
    );
} 