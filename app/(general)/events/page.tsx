import React, { Suspense } from "react";
import PageHeader from "@/components/page-header"
import Eventfeed from "./_components/event-feed";
import { Skeleton } from "@/components/ui/skeleton";

// A simple loading component for Suspense fallback
function EventFeedLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8 mt-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-rounded border-enugu shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <div className="flex flex-col space-y-2 mb-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                </div>
                <div className="mt-auto pt-4 flex items-center space-x-3">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
 
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Upcoming Events"
        description="Stay informed about our organization's upcoming events, meetings, and activities."
      />

      <Suspense fallback={<EventFeedLoading />}>
        <Eventfeed />
      </Suspense>
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

