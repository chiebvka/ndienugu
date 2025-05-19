"use client"

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/supabase";
import { toast } from "sonner";
import { useSearchParams } from 'next/navigation';

type Props = {}

type EventType = Tables<"events">; 

export default function Eventfeed({}: Props) {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 5;
    const searchParams = useSearchParams();
    const [eventToOpen, setEventToOpen] = useState<string | null>(null);
  
    useEffect(() => {
      const eventIdFromQuery = searchParams.get('openEvent');
      if (eventIdFromQuery) {
        setEventToOpen(eventIdFromQuery);
        const element = document.getElementById(`event-${eventIdFromQuery}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, [searchParams]);
  
    const fetchEvents = useCallback(async (pageNum: number, reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      console.log(`EventsPage: Fetching events - page: ${pageNum}, reset: ${reset}`);
      try {
        const response = await axios.get("/api/events", {
          params: { page: pageNum, limit: LIMIT },
        });
        
        console.log("EventsPage: API Response data:", response.data);
        const { events: newEvents, total } = response.data;
  
        if (!Array.isArray(newEvents)) {
          console.error("EventsPage: API did not return 'events' as an array.", response.data);
          toast.error("Failed to process events from server.");
          setEvents(reset ? [] : events);
          setHasMore(false);
          return;
        }
  
        const updatedEvents = reset ? newEvents : [...events, ...newEvents];
        setEvents(updatedEvents);
        setHasMore(pageNum * LIMIT < total);
        setPage(pageNum);

        if (eventToOpen) {
            const foundEvent = updatedEvents.find(e => e.id === eventToOpen);
            if (foundEvent) {
                setTimeout(() => {
                    const element = document.getElementById(`event-${eventToOpen}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 0);
            }
        }
  
      } catch (error: any) {
        console.error("EventsPage: Error fetching events:", error);
        if (error.response) {
          toast.error(`Failed to fetch events: ${error.response.data?.error || error.response.statusText || 'Server error'}`);
        } else {
          toast.error("Failed to fetch events: An unexpected error occurred.");
        }
         if(reset) setEvents([]);
         setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, LIMIT, events, eventToOpen]);
  
    useEffect(() => {
      fetchEvents(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const handleViewMore = () => {
      if (!isLoading && hasMore) {
        fetchEvents(page + 1);
      }
    };


    const mapSupabaseEventToCardProps = (eventData: EventType) => {
        let displayTime = "TBD";
    
        const formatToHourMinuteOnly = (timeStr: string | null | undefined): string | null => {
          if (!timeStr) return null;
          // Check if it's in HH:MM:SS or HH:MM format, or includes AM/PM
          // This regex is a bit more general: looks for HH:MM and optionally seconds or AM/PM
          const match = timeStr.match(/(\d{1,2}:\d{2})(?::\d{2})?(\s*(?:AM|PM))?/i);
          if (match) {
            // match[1] is HH:MM, match[2] is optional AM/PM part (including leading space)
            return match[1] + (match[2] ? match[2].toUpperCase() : ''); 
          }
          return timeStr; // Fallback if format is unexpected
        };
    
        const formattedStartTime = formatToHourMinuteOnly(eventData.start_time);
        const formattedEndTime = formatToHourMinuteOnly(eventData.end_time);
        const formattedEventTime = formatToHourMinuteOnly(eventData.event_time); // Fallback
    
        if (formattedStartTime && formattedEndTime) {
          displayTime = `${formattedStartTime} - ${formattedEndTime}`;
        } else if (formattedStartTime) {
          displayTime = formattedStartTime;
        } else if (formattedEventTime) { // Fallback to single event_time if start/end are not present
          displayTime = formattedEventTime;
        }
    
        return {
          id: eventData.id,
          title: eventData.name || "Untitled Event",
          description: eventData.summary || eventData.content || "No description available.",
          date: eventData.event_date || "TBD",
          time: displayTime, // Use the formatted displayTime
          location: eventData.venue || "TBD",
          imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byGuCaj5tkSrU0hi93DmW2eynVJLofPl6QECFG", // Updated image URL
          requirements: eventData.content ? eventData.content.split('\n').slice(0,3) : ["Details to be confirmed."],
        };
      };
    
    
      if (isLoading && events.length === 0) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="mt-12">Loading events...</p>
          </div>
        );
      }

  return (
    <div className="max-w-7xl mx-auto">
        {events.length === 0 && !isLoading && !hasMore ? (
        <p className="text-center text-muted-foreground mt-12">
            No upcoming events found at the moment. Please check back later!
        </p>
        ) : (
        <div className="space-y-8 mt-12">
            {events.map((eventData) => (
            <EventCard 
                key={eventData.id} 
                event={mapSupabaseEventToCardProps(eventData)}
                autoOpen={eventData.id === eventToOpen}
            />
            ))}
        </div>
        )}

        {hasMore && (
        <div className="mt-12 text-center">
            <Button onClick={handleViewMore} disabled={isLoading} variant="outline">
            {isLoading ? "Loading..." : "View More Events"}
            </Button>
        </div>
        )}
        {!isLoading && !hasMore && events.length > 0 && (
            <p className="text-center text-muted-foreground mt-12 py-4">You&apos;ve seen all upcoming events.</p>
        )}
    </div>
  )
}