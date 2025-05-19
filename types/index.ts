export interface BoardMember {
  id: number
  name: string
  position: string
  bio: string
  imageUrl: string
}
export interface PatronMember {
  id: number
  name: string
  bio: string
  date: string
  imageUrl: string
}

export interface GalleryItem {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  category: string
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  authorAvatar?: string
  imageUrl: string
  readTime?: string
  slug: string
  tags?: string[]
  relatedPosts?: number[]
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  imageUrl: string
  requirements: string[]
  registrationLink: string
}

