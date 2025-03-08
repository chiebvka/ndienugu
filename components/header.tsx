"use client"
 
 import type React from "react"
 
 import { useState } from "react"
 import Link from "next/link"
 import Image from "next/image"
 import { Menu, Search, ChevronRight } from "lucide-react"
 import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
 import { Input } from "@/components/ui/input"
 import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
 
 export default function Header() {
   const [isSearchOpen, setIsSearchOpen] = useState(false)
   const [isSheetOpen, setIsSheetOpen] = useState(false)
 
   return (
     <header className="bg-gradient-primary z-50 text-white shadow-md">
       <div className="container mx-auto px-4">
         <div className="flex items-center justify-between h-20 w-[85%] mx-auto">
           <Link href="/" className="flex items-center space-x-3">
             <div className="relative h-16 w-16 rounded-full bg-white p-1">
               <Image
                 src="/logo.png"
                 alt="Organization Logo"
                 width={60}
                 height={60}
                 className="object-contain rounded-full"
                 priority
               />
             </div>
             <span className="text-lg font-bold"></span>
           </Link>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center space-x-8 bg-white/10 px-6 py-2 rounded-full">
             <Link href="/" className="hover:text-accent transition-colors">
               Home
             </Link>
             <Link href="/board" className="hover:text-accent transition-colors">
               Board
             </Link>
             <Link href="/gallery" className="hover:text-accent transition-colors">
               Gallery
             </Link>
             <Link href="/blog" className="hover:text-accent transition-colors">
               News
             </Link>
             <Link href="/events" className="hover:text-accent transition-colors">
               Events
             </Link>
           </nav>
 
           {/* Mobile Navigation with Sheet */}
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
             <SheetTrigger asChild>
               <button className="md:hidden p-2">
                 <Menu size={24} />
               </button>
             </SheetTrigger>
             <SheetContent
               side="right"
               className="border-r-primary-dark w-[85vw] sm:w-[400px] p-0"
             >
               <div className="h-full flex flex-col">
                 <SheetHeader className="p-6 border-b border-white/10">
                   <SheetTitle className=" flex items-center gap-3">
                     <div className="relative h-10 w-10 rounded-full bg-white p-1">
                       <Image
                         src="/logo.png"
                         alt="Organization Logo"
                         width={40}
                         height={40}
                         className="object-contain"
                       />
                     </div>
                     {/* <span>Organization Name</span> */}
                   </SheetTitle>
                 </SheetHeader>
 
                 <div className="flex-1 overflow-y-auto">
                   <div className="p-6">
                 
 
                     <nav className="flex flex-col space-y-1">
                       <MobileNavLink href="/" label="Home" onClick={() => setIsSheetOpen(false)} />
                       <MobileNavLink href="/board" label="Board of Directors" onClick={() => setIsSheetOpen(false)} />
                       <MobileNavLink href="/gallery" label="Media Gallery" onClick={() => setIsSheetOpen(false)} />
                       <MobileNavLink href="/blog" label="News & Press" onClick={() => setIsSheetOpen(false)} />
                       <MobileNavLink href="/events" label="Events" onClick={() => setIsSheetOpen(false)} />
                     </nav>
                   </div>
                 </div>
 
               </div>
             </SheetContent>
           </Sheet>
         </div>
       </div>
 
       {/* Desktop Search Bar */}
       {/* {isSearchOpen && (
         <div className="hidden md:block border-t border-primary-dark py-3">
           <div className="container mx-auto px-4">
             <div className="relative max-w-md mx-auto">
               <input
                 type="text"
                 placeholder="Search..."
                 className="w-full py-2 px-4 bg-white/10 rounded-md text-white placeholder-white/70 border border-white/20 focus:outline-none focus:border-white/40"
                 autoFocus
               />
               <Search className="absolute right-3 top-2.5 text-white/70" size={20} />
             </div>
           </div>
         </div>
       )} */}
     </header>
   )
 }
 
 // Helper component for mobile navigation links
 function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
   return (
     <Link
       href={href}
       className="flex items-center justify-between py-3 px-2 rounded-md transition-colors"
       onClick={onClick}
     >
       <span>{label}</span>
     </Link>
   )
 }
 
 // Helper component for social icons
 function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
   return (
     <a
       href={href}
       className="text-white/80 hover:text-white transition-colors"
       target="_blank"
       rel="noopener noreferrer"
     >
       {icon}
     </a>
   )
 }