// NOTE: This is a client component for cookie-based redirect logic.\n// Next.js metadata cannot be set here.\n// If SEO metadata is needed, set fallback metadata in the parent layout or a static parent page.\n
"use client"

import Membershipform from '@/components/membership-form'
import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

type Props = {}

// Function to get a cookie (can be moved to a utility file if used elsewhere)
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Ensure document is defined (client-side)
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function Page({}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  

  // const memberVerifiedCookie = getCookie("ndienugu_member_verified");
  // if (memberVerifiedCookie === "true") {
  //   redirect("/members/feed");
  // }

  useEffect(() => {
    const memberVerifiedCookie = getCookie("ndienugu_member_verified");
    if (memberVerifiedCookie === "true") {
      router.push("/members/feed");
    } else {
      setIsLoading(false); // Only stop loading if not redirecting
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <p>Loading...</p> {/* Or a more sophisticated loader */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4  py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-0">
        <PageHeader
            title="Memeberships Application"
            description="Submit your application to become a member and join our community."
        />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/members/feed">
            View Members Feed
          </Link>
        </Button>
      </div>
        <div className="max-w-7xl mx-auto mt-8 sm:mt-0">
            <Membershipform />
        </div>

    </div>
  )
}