import Image from "next/image"
// We'll create a more specific type here for what EventCard uses, 
// or you should update the global 'Event' type in '@/types'
// import type { Event } from "@/types" 
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, MapPin, Share2 } from "lucide-react"
import RegistrationFormThree from "./registration-form-three"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Define the shape of the event prop that EventCard now expects,
// aligning with what mapSupabaseEventToCardProps provides.
// Ideally, your global 'Event' type in '@/types' should be updated to this.
interface DisplayEvent {
  id: string; // Changed from number to string
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string | null; // Match the mapped prop, can be null from DB
  requirements: string[];
  // registrationLink: string; // This will be handled by the form button now
}

interface EventCardProps {
  event: DisplayEvent; // Use the DisplayEvent interface
  autoOpen?: boolean; // Added autoOpen prop
}

export default function EventCard({ event, autoOpen = false }: EventCardProps) {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/events?openEvent=${event.id}#event-${event.id}`;
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success("Event link copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy link: ", err);
          toast.error("Failed to copy link.");
        });
    } else {
      toast.error("Cannot share event at this time.");
    }
  };

  return (
    <div id={`event-${event.id}`} className="bg-white rounded-lg border border-rounded border-enugu shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-64 md:h-auto">
          <Image src={event.imageUrl || "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byGuCaj5tkSrU0hi93DmW2eynVJLofPl6QECFG"} alt={event.title} fill className="object-cover" />
        </div>
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="md:text-2xl text-lg font-bold mb-2">{event.title}</h3>

            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-primary" />
                <time dateTime={event.date}>{formatDate(event.date)}</time>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm md:text-base mb-6">{event.description}</p>

            {event.requirements && event.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Details:</h4>
                <ul className="space-y-1">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700 text-sm md:text-base">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 flex items-center space-x-3">
            <RegistrationFormThree 
              eventId={event.id} 
              eventTitle={event.title}
              eventDate={formatDate(event.date)}
              eventTime={event.time}
              eventLocation={event.location}
              autoOpen={autoOpen}
            />
            <Button  onClick={handleShare} aria-label="Share event" className="bg-green-100 text-enugu hover:bg-green-200  flex items-center">
              <Share2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Share Event Link</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

