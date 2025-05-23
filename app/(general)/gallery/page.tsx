import type React from "react"
import PageHeader from "@/components/page-header"
import Galleryfeed from "./_components/gallery-feed"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Media Gallery"
        description="Browse photos and videos from our organization's meetings, events, and activities."
      />
      <div className="max-w-7xl mx-auto">
        <Galleryfeed />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Gallery | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Browse photos and videos from our organization's meetings, events, and activities.",
  openGraph: {
    title: "Gallery | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Browse photos and videos from our organization's meetings, events, and activities.",
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
    title: "Gallery | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Browse photos and videos from our organization's meetings, events, and activities.",
    images: ["https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N"],
  },
};



