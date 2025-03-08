"use client"

import { Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url?: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(currentUrl)}`,
      color: "bg-red-500 hover:bg-red-600",
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="flex flex-wrap gap-3">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 ${link.color} text-white rounded-md transition-colors`}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
          <span>{link.name}</span>
        </a>
      ))}

      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-md hover:shadow-md transition-all"
      >
        <LinkIcon size={18} />
        <span>Copy Link</span>
      </button>
    </div>
  )
}

