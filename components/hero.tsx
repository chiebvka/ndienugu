"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight, Calendar, FileText, Users } from "lucide-react"

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const slides = [
    {
      title: "Welcome to Ndi Enugu Scotland Association",
      description: "The Ndi Enugu Scotland Association (NESA) is a distinguished community of Ndi Enugu residing in Scotland, dedicated to fostering unity, cultural heritage, and progressive development both within their Scottish diaspora and their homeland in Enugu",
      image: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byVZvOUtPEsYNLv4rwhS0WaH9XVRZjOkIA3CBg?height=800&width=1600",
      cta: "Upcoming Events",
      link: "/events",
    },
    {
      title: "Building a Sustainable Future",
      description: "The journey of NESA has just begun, and its future is bright. The association stands as a beacon of hope, a bridge between two worlds, and a model for other communities striving to make a meaningful impact both at home and abroad.",
      image: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byhkq14hrnPzk8gbaZuJ4BVx0RlXoSA9ds1e6M?height=800&width=1600",
      cta: "Our Initiatives",
      link: "/blog",
    },
    {
      title: "Empowering Communities through Education",
      description: "Through these engagements, NESA has established itself as a vibrant and forward-thinking association, embodying the resilience, excellence, and communal spirit of Ndi Enugu in the diaspora",
      image: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byGnT8r7tkSrU0hi93DmW2eynVJLofPl6QECFG?height=800&width=1600",
      cta: "Get Involved",
      link: "/events",
    },
  ]

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [slides.length])

  const handleSlideChange = (index: number) => {
    setActiveSlide(index)
  }

  return (
    <div className="relative bg-black text-white min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                activeSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 absolute"
              }`}
              style={{ display: activeSlide === index ? "block" : "none" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{slide.title}</h1>
              <p className="text-sm md:text-lg mb-8">{slide.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.link}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-medium rounded-md hover:shadow-lg transition-all"
                >
                  {slide.cta}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-md hover:bg-white/20 transition-all"
                >
                  Latest News
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="flex space-x-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === index ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Info cards - Updated mobile styling */}
      <div
        className={`container mx-auto px-4 absolute -bottom-32 sm:-bottom-20 md:bottom-0 left-0 right-0 z-30 transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 flex rounded-lg items-center space-x-4 hover:shadow-xl transition-all group backdrop-blur-lg bg-white/10">
            <div className="p-3 bg-gradient-primary rounded-full flex-shrink-0">
              <Calendar className="text-white h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate">Upcoming Events</h3>
              <Link href="/events" className="text-sm text-white/90 group-hover:underline flex items-center">
                View calendar <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 flex rounded-lg items-center space-x-4 hover:shadow-xl transition-all group backdrop-blur-lg bg-white/10">
            <div className="p-3 bg-gradient-primary rounded-full flex-shrink-0">
              <FileText className="text-white h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate">Press Releases</h3>
              <Link href="/blog" className="text-sm text-white/90 group-hover:underline flex items-center">
                Latest news <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 flex rounded-lg items-center space-x-4 hover:shadow-xl transition-all group backdrop-blur-lg bg-white/10 sm:col-span-2 md:col-span-1">
            <div className="p-3 bg-gradient-primary rounded-full flex-shrink-0">
              <Users className="text-white h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate">Board of Directors</h3>
              <Link href="/board" className="text-sm text-white/90 group-hover:underline flex items-center">
                Meet the team <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

