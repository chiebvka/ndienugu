import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NdiEnugu Scotland</h3>
            <p className="mb-4">
              Dedicated to community development and sustainable growth through collaborative initiatives and strategic
              partnerships.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/board" className="hover:text-accent transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Organization Street, City, State, ZIP</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>info@organization.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter to receive updates on our activities and events.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:border-accent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-accent text-black font-medium rounded-md hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Organization Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

