import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-primary text-white">
      <div className=" px-4 py-12">
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
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <a href="mailto:info@ndienuguscotland.org" className="hover:text-accent transition-colors">
                  info@ndienuguscotland.org
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1 flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4">Have an Inquiry?</h3>
            <p className="mb-4">
              We&apos;d love to hear from you. Click the button below to send us an email.
            </p>
            <a
              href={`mailto:info@ndienuguscotland.org?subject=${encodeURIComponent("Inquiry from NdiEnugu Scotland Website")}&body=${encodeURIComponent(
                "Hello NdiEnugu Scotland Team,\n\nI would like to make an inquiry.\n\nName: [Please enter your name]\n\nContact Details: [Please enter your phone or preferred contact]\n\nInquiry:\n[Please describe your inquiry here]\n\nThank you"
              )}`}
              className="w-full px-6 py-3 bg-accent text-black font-medium rounded-md hover:bg-accent/90 transition-colors text-center inline-block"
            >
              Send an Inquiry
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm">
          <p>Powered  by {new Date().getFullYear()} <Link href="https://bexoni.com" target="_blank" className="hover:text-accent underline transition-colors">Bexoni Labs</Link>. &copy; All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

