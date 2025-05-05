"use client"

import React from 'react';
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { Calendar, Users, BookOpen, Award } from "lucide-react"
import PageHeader from '@/components/page-header';

type Props = {}

export default function page({}: Props) {

    const [activeSection, setActiveSection] = useState("intro")
    const sectionRefs = {
      intro: useRef(null),
      founding: useRef(null),
      structure: useRef(null),
      meetings: useRef(null),
      legacy: useRef(null),
    }
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY + 200
  
        Object.entries(sectionRefs).forEach(([section, ref]) => {
          if (ref.current && scrollPosition >= (ref.current as HTMLElement).offsetTop) {
            setActiveSection(section)
          }
        })
      }
  
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    const scrollToSection = (section: keyof typeof sectionRefs) => {
      const element = sectionRefs[section].current as HTMLElement | null;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

  return (
    <div className='container mx-auto px-4 py-12'>
        <PageHeader
        title="Our History & Legacy"
        description="The journey of Ndi Enugu Scotland Association - from vision to reality."
      />
      

      <div className='max-w-7xl mx-auto'>
        {/* Side Navigation */}
        <div className="hidden lg:block fixed right-10 top-1/2 transform -translate-y-1/2 z-40">
            <div className="bg-white/80 backdrop-blur-sm rounded-full py-4 px-2 shadow-lg">
            <ul className="space-y-6">
                <li>
                <button
                    onClick={() => scrollToSection("intro")}
                    className={`p-2 rounded-full ${activeSection === "intro" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    aria-label="Go to Introduction"
                >
                    <div className="h-3 w-3"></div>
                </button>
                </li>
                <li>
                <button
                    onClick={() => scrollToSection("founding")}
                    className={`p-2 rounded-full ${activeSection === "founding" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    aria-label="Go to Founding section"
                >
                    <div className="h-3 w-3"></div>
                </button>
                </li>
                <li>
                <button
                    onClick={() => scrollToSection("structure")}
                    className={`p-2 rounded-full ${activeSection === "structure" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    aria-label="Go to Structure section"
                >
                    <div className="h-3 w-3"></div>
                </button>
                </li>
                <li>
                <button
                    onClick={() => scrollToSection("meetings")}
                    className={`p-2 rounded-full ${activeSection === "meetings" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    aria-label="Go to Meetings section"
                >
                    <div className="h-3 w-3"></div>
                </button>
                </li>
                <li>
                <button
                    onClick={() => scrollToSection("legacy")}
                    className={`p-2 rounded-full ${activeSection === "legacy" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    aria-label="Go to Legacy section"
                >
                    <div className="h-3 w-3"></div>
                </button>
                </li>
            </ul>
            </div>
        </div>

        {/* Main Content */}
        <main className='w-full'>
            {/* Introduction */}
            <section ref={sectionRefs.intro} className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">
                    History of Ndi Enugu Scotland Association
                </h2>
                <p className="text-xl text-center leading-relaxed">
                    The Ndi Enugu Scotland Association (NESA) is a distinguished community of Ndi Enugu residing in
                    Scotland, dedicated to fostering unity, cultural heritage, and progressive development both within their
                    Scottish diaspora and their homeland in Enugu, Nigeria.
                </p>
                </div>
            </div>
            </section>

            {/* Founding Section */}
            <section ref={sectionRefs.founding} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/2">
                    <div className="sticky top-32">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 text-green-800 mb-6">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>March 11, 2022</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-700 mb-6">Founding and Establishment</h2>
                        <p className="text-lg text-gray-700 mb-4">
                        The idea of NESA was birthed from a collective vision of Ndi Enugu in Scotland, who recognized the
                        need for an organized body that would serve as a beacon of support, cultural preservation, and
                        philanthropic engagement. This vision materialized on the 11th of March 2022, when NESA was
                        officially established with its headquarters in Aberdeen, United Kingdom.
                        </p>
                        <p className="text-lg text-gray-700">
                        Following its formation, the association held its first-ever in-person meeting on 22nd April 2022,
                        marking a significant milestone in its journey. This historic gathering was graciously hosted by
                        Chukwudi Orji at his residence in Aberdeen, bringing together pioneering members who shared a
                        common vision of unity and progress.
                        </p>
                    </div>
                    </div>
                    <div className="md:w-1/2">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                        <h3 className="text-2xl font-bold text-green-700 mb-6">Founding Members</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                            "Frank Anozie",
                            "Chris Eze",
                            "Afam Agu",
                            "Obinna Ugwu",
                            "Romanus Eze",
                            "Uche Okwu",
                            "Emeka Onuh",
                            "Chukwudi Orji",
                            "Stan Amadi",
                            ].map((member, index) => (
                            <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center mr-3">
                                {member.charAt(0)}
                                </div>
                                <span className="font-medium">{member}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                        <div className="relative h-80">
                        <Image
                            src="https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byGnT8r7tkSrU0hi93DmW2eynVJLofPl6QECFG?height=400&width=600&query=first meeting of Nigerian association in Scotland"
                            alt="First NESA Meeting"
                            fill
                            className="object-cover"
                        />
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Structure Section */}
            <section ref={sectionRefs.structure} className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/2 order-2 md:order-1">
                    <div className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden h-full">
                        <div className="p-8">
                        <h3 className="text-2xl font-bold text-green-700 mb-6">Three Core Arms</h3>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
                            <h4 className="font-bold text-xl mb-2 text-green-700">Official Members</h4>
                            <p>
                                The general body of Ndi Enugu residing in Scotland who have formally registered with the
                                association.
                            </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
                            <h4 className="font-bold text-xl mb-2 text-green-700">Executive Members</h4>
                            <p>
                                Elected leaders who oversee the day-to-day operations, decision-making, and overall
                                governance of NESA.
                            </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
                            <h4 className="font-bold text-xl mb-2 text-green-700">Committee Members</h4>
                            <p>
                                Individuals tasked with specific responsibilities to ensure the efficient execution of the
                                association's initiatives.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                    <div className="sticky top-32">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 text-green-800 mb-6">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Organizational Structure</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-700 mb-6">Structure and Growth</h2>
                        <p className="text-lg text-gray-700 mb-4">
                        Since its inception, NESA has been structured into three core arms that work together to achieve
                        the association's objectives and ensure its smooth operation.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                        NESA continues to experience steady growth in membership, drawing individuals from various towns
                        across Scotland who are committed to its vision and objectives. In addition, the association is
                        privileged to have the guidance and support of two esteemed patrons whose wisdom and leadership
                        continue to inspire the collective mission of the organization.
                        </p>
                        <p className="text-lg text-gray-700">
                        This structured approach has allowed NESA to maintain focus on its core mission while adapting to
                        the growing needs of its community.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Meetings Section */}
            <section ref={sectionRefs.meetings} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/2">
                    <div className="sticky top-32">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 text-green-800 mb-6">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <span>Bi-Monthly Gatherings</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-700 mb-6">Meetings and Community Engagement</h2>
                        <p className="text-lg text-gray-700 mb-4">
                        To uphold its founding principles, NESA holds bi-monthly meetings, providing a dynamic platform
                        for members to deliberate on issues that align with the association's constitution. These
                        discussions focus on the advancement of the Enugu community in Scotland, strategic development
                        efforts back home in Enugu, Nigeria, and initiatives that foster cultural unity and welfare for
                        its members.
                        </p>
                        <p className="text-lg text-gray-700">
                        Through these engagements, NESA has established itself as a vibrant and forward-thinking
                        association, embodying the resilience, excellence, and communal spirit of Ndi Enugu in the
                        diaspora.
                        </p>
                    </div>
                    </div>
                    <div className="md:w-1/2">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byhkq14hrnPzk8gbaZuJ4BVx0RlXoSA9ds1e6M?height=400&width=600&query=Nigerian community meeting in Scotland"
                            alt="NESA Community Meeting"
                            fill
                            className="object-cover"
                        />
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <h3 className="text-2xl font-bold text-green-700 mb-4">Key Focus Areas</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center mt-1 mr-3">
                                1
                            </div>
                            <p>Advancement of the Enugu community in Scotland</p>
                            </li>
                            <li className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center mt-1 mr-3">
                                2
                            </div>
                            <p>Strategic development efforts in Enugu, Nigeria</p>
                            </li>
                            <li className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center mt-1 mr-3">
                                3
                            </div>
                            <p>Cultural unity and welfare initiatives for members</p>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Legacy Section */}
            <section ref={sectionRefs.legacy} className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/2 order-2 md:order-1">
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                        <Image
                        src="https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byWF0AKEowg8traxph0fYqZmI1GH3v9yMFcklb?height=500&width=700&query=bridge connecting Scotland and Nigeria with green theme"
                        alt="NESA Legacy"
                        fill
                        className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">A Bridge Between Two Worlds</h3>
                            <p>Connecting Scotland and Nigeria through community and culture</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                    <div className="sticky top-32">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 text-green-800 mb-6">
                        <Award className="h-5 w-5 mr-2" />
                        <span>Our Achievements</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-700 mb-6">A Legacy of Excellence</h2>
                        <p className="text-lg text-gray-700 mb-4">
                        From its humble beginnings to its present standing, NESA remains a testament to the power of unity
                        and purpose. It is not just an association; it is a family, a movement, and a legacy in the
                        making. As the association continues to expand and evolve, its members remain committed to
                        ensuring that the values of brotherhood, progress, and service remain at the heart of everything
                        they do.
                        </p>
                        <p className="text-lg text-gray-700">
                        The journey of NESA has just begun, and its future is bright. The association stands as a beacon
                        of hope, a bridge between two worlds, and a model for other communities striving to make a
                        meaningful impact both at home and abroad.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </main>
      
      </div>
    </div>
  )
}