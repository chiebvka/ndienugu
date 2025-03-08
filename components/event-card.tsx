import Image from "next/image"
import type { Event } from "@/types"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, MapPin } from "lucide-react"

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div id={`event-${event.id}`} className="bg-white rounded-lg border border-rounded border-enugu shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-64 md:h-auto">
          <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>

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

          <p className="text-gray-700 mb-6">{event.description}</p>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {event.requirements.map((requirement, index) => (
                <li key={index} className="text-gray-700">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={event.registrationLink}
            className="inline-block px-6 py-3 bg-enugu text-white font-medium rounded-md hover:bg-enugu/50 transition-colors"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  )
}

