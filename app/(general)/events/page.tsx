import EventCard from "@/components/event-card"
import PageHeader from "@/components/page-header"
import type { Event } from "@/types"


// This would typically come from a database or CMS
const events: Event[] = [
  {
    id: 1,
    title: "Annual General Meeting 2025",
    description:
      "Join us for our Annual General Meeting where we will review our achievements, discuss future plans, and elect new board members.",
    date: "2025-04-15",
    time: "10:00 AM - 2:00 PM",
    location: "Organization Headquarters, Main Conference Room",
    imageUrl: "/event1.jpeg?height=300&width=600",
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
    date: "2025-03-22",
    time: "9:00 AM - 4:00 PM",
    location: "Community Center, Workshop Room B",
    imageUrl: "/event2.jpeg?height=300&width=600",
    requirements: [
      "Open to all community members",
      "Registration required (limited to 30 participants)",
      "Participants should bring notebooks and laptops if possible",
    ],
    registrationLink: "#",
  },
  {
    id: 3,
    title: "Fundraising Gala Dinner",
    description:
      "An elegant evening to raise funds for our education initiatives, featuring guest speakers and entertainment.",
    date: "2025-05-10",
    time: "6:30 PM - 10:00 PM",
    location: "Grand Hotel, Ballroom",
    imageUrl: "/event3.jpeg?height=300&width=600",
    requirements: [
      "Formal attire required",
      "Tickets: $100 per person or $900 for a table of 10",
      "RSVP by April 25th with dietary requirements",
    ],
    registrationLink: "#",
  },
  {
    id: 4,
    title: "Strategic Planning Retreat",
    description: "A two-day retreat for board members and senior staff to develop our next three-year strategic plan.",
    date: "2025-06-15",
    time: "9:00 AM (Day 1) - 4:00 PM (Day 2)",
    location: "Riverside Resort and Conference Center",
    imageUrl: "/event4.jpeg?height=300&width=600",
    requirements: [
      "For board members and invited staff only",
      "Overnight accommodation provided",
      "Bring organizational documents and reports as specified in pre-retreat email",
    ],
    registrationLink: "#",
  },
  {
    id: 5,
    title: "Community Health Fair",
    description: "A free health fair offering screenings, information, and resources to community members.",
    date: "2025-07-08",
    time: "10:00 AM - 3:00 PM",
    location: "Community Park",
    imageUrl: "/event1.jpeg?height=300&width=600",
    requirements: [
      "Open to all community members",
      "No registration required",
      "Bring identification for certain health screenings",
    ],
    registrationLink: "#",
  },
]

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Upcoming Events"
        description="Stay informed about our organization's upcoming events, meetings, and activities."
      />

      <div className="max-w-7xl mx-auto">
        <div className="space-y-8 mt-12">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

