"use client"

import { useState } from "react"
import Image from "next/image"
import type { GalleryItem } from "@/types"
import { formatDate } from "@/lib/utils"
import { X } from "lucide-react"

interface GalleryGridProps {
  items: GalleryItem[]
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === category ? "bg-primary text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative h-64">
              <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1">{item.title}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{item.category}</span>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for enlarged view */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>

            <div className="relative h-[74vh]">
              <Image
                src={selectedItem.imageUrl || "/placeholder.svg"}
                alt={selectedItem.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-gray-700 mb-2">{selectedItem.description}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{selectedItem.category}</span>
                <time dateTime={selectedItem.date}>{formatDate(selectedItem.date)}</time>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

