import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"

export default function BlogPostSidebar() {
  return (
    <div className="space-y-8">
      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Search Articles</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/blog?category=funding"
              className="text-gray-700 hover:text-primary flex justify-between items-center"
            >
              <span>Funding</span>
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">12</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blog?category=community"
              className="text-gray-700 hover:text-primary flex justify-between items-center"
            >
              <span>Community Development</span>
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">8</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blog?category=partnerships"
              className="text-gray-700 hover:text-primary flex justify-between items-center"
            >
              <span>Partnerships</span>
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">15</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blog?category=reports"
              className="text-gray-700 hover:text-primary flex justify-between items-center"
            >
              <span>Reports</span>
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">6</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blog?category=events"
              className="text-gray-700 hover:text-primary flex justify-between items-center"
            >
              <span>Events</span>
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">9</span>
            </Link>
          </li>
        </ul>
      </div> */}

      <div className="bg-gradient-primary text-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="mb-4 text-white/90">Stay updated with our latest news and announcements.</p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-primary font-medium rounded-md hover:bg-white/90 transition-colors"
          >
            Subscribe
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog?tag=funding"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Funding
          </Link>
          <Link
            href="/blog?tag=community"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Community
          </Link>
          <Link
            href="/blog?tag=development"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Development
          </Link>
          <Link
            href="/blog?tag=partnerships"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Partnerships
          </Link>
          <Link
            href="/blog?tag=infrastructure"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Infrastructure
          </Link>
          <Link
            href="/blog?tag=reports"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Reports
          </Link>
          <Link
            href="/blog?tag=education"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Education
          </Link>
          <Link
            href="/blog?tag=health"
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Health
          </Link>
        </div>
      </div>
    </div>
  )
}

