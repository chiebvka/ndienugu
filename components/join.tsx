'use client'

import {  FormInput } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { cn } from "@/lib/utils"
import Link from 'next/link'



 
const notifications = [
  {
    title: "Supporting and collaborating with each other in any legitimate business ventures for the success of our families such as collective investments in Enugu State..",
    description: "",
  },
  {
    title: "Collaborating & being a strong partner to Umu Ada Enugu association in any legitimate venture or activities they embark on",
    description: "",
  },
  {
    title: "Harnessing any legitimate opportunities that we see or are invited to participate in in Enugu State Nigeria",
    description: "",
  },
  {
    title: "Support & promote the educational and mental well-being of the less privileged people in Enugu state through but not limited to offering educational scholarships and or enabling private small scale business ventures where possible",
    description: "",
  },
  {
    title: " Promoting the spirit of togetherness and brotherhood between NDI ENUGU and their families through social interactions",
    description: "",
  },
  {
    title: "Serving as the umbrella association under which Igbo men and women of Enugu origin, their wives, husbands, and children may come together in achieving the common goal of understanding and self-help",
    description: "",
  },
  {
    title: " Keeping Igbo traditions and customs alive as celebrated in our rich festivals and cultural institutions.",
    description: "",
  },
  {
    title: "Promoting the teaching of Igbo language and culture as well as any other beneficial subjects to our children in Scotland.",
    description: "",
  },
  {
    title: "Discouraging acrimony between members and their families by outsiders",
    description: "",
  },
  {
    title: "Fostering cultural understanding between Igbos and people from other Nationalities through the promotion of cultural exchange.",
    description: "",
  },
]


type CardProps = React.ComponentProps<typeof Card>

export default function Join({ className, ...props }: CardProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Need to join</h2>
        <p className="mt-2 md:text-lg/8 text-gray-600">Want to join and become a member? Fill in the form below and we will get back to you as soon as possible.</p>
      </div>
      <Card className={cn("md:w-9/12 mx-auto mt-4", className)} {...props}>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-enugu'>Membership</CardTitle>
        <CardDescription>Before Submitting a membership request here are outlined goals and objectives.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-enugu" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/members">
            <FormInput className='mr-2' /> Register
          </Link>
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
