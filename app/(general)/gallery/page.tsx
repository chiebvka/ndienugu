

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



