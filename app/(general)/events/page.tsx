import React from "react";
import PageHeader from "@/components/page-header"
import Eventfeed from "./_components/event-feed";

export default function EventsPage() {
 
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Upcoming Events"
        description="Stay informed about our organization's upcoming events, meetings, and activities."
      />

      <Eventfeed />
    </div>
  )
}

export const metadata = {
  title: "Events | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Stay informed about our organization's upcoming events, meetings, and activities.",
  openGraph: {
    title: "Events | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Stay informed about our organization's upcoming events, meetings, and activities.",
    images: [
      {
        url: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N",
        width: 1200,
        height: 630,
        alt: "NDI ENUGU SCOTLAND ASSOCIATION Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Stay informed about our organization's upcoming events, meetings, and activities.",
    images: ["https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N"],
  },
};

