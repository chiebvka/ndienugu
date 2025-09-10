import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-primary">Maintenance</h1>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        This site is temporarily unavailable due to an expired domain.
      </h2>
      <p className="mt-6 text-lg leading-7 text-muted-foreground">
        Please have the site admin  <span className='text-enugu'>support@bexoni.com</span> renew the domain to restore access.
      </p>
      {/* <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild className=" hover:bg-primary/60 text-white">
          <Link href="/">
            Go back home
          </Link>
        </Button>
      </div> */}
    </div>
  </div>
  )
}