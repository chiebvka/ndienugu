import Link from "next/link"
import Image from "next/image"
import type { Event } from "@/types"
import { formatDate } from "@/lib/utils"
import { Calendar } from "lucide-react"

// This would typically come from a database or CMS
const featuredEvents: Event[] = [
  {
    id: 1,
    title: "Annual General Meeting 2024",
    description:
      "Join us for our Annual General Meeting where we will review our achievements, discuss future plans, and elect new board members.",
    date: "2024-04-15",
    time: "10:00 AM - 2:00 PM",
    location: "Organization Headquarters, Main Conference Room",
    imageUrl: "/placeholder.svg?height=300&width=600",
    requirements: [
      "Membership ID required for voting",
      "RSVP by April 5th",
      "Bring a copy of the annual report (will be emailed in advance)",
    ],
    registrationLink: "#",
  },
  {
    id: 2,
    title: "Community Development Workshop",
    description: "A hands-on workshop focused on sustainable community development practices and project planning.",
    date: "2024-03-22",
    time: "9:00 AM - 4:00 PM",
    location: "Community Center, Workshop Room B",
    imageUrl: "/placeholder.svg?height=300&width=600",
    requirements: [
      "Open to all community members",
      "Registration required (limited to 30 participants)",
      "Participants should bring notebooks and laptops if possible",
    ],
    registrationLink: "#",
  },
]

export default function FeaturedEvents() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
        <Link href="/events" className="text-primary hover:underline font-medium">
          View all events
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar size={16} className="mr-2" />
                <time dateTime={event.date}>{formatDate(event.date)}</time>
                <span className="mx-2">•</span>
                <span>{event.time}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <Link
                href={`/events#event-${event.id}`}
                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

