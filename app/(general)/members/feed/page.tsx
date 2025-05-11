"use client"

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/page-header'
import Memeberaccessform from './_components/memeber-access-form'
import Feedwizard from './_components/feed-wizard'

// Function to get a cookie
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function MemberFeedPage() {
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true); // To prevent flash of form

  useEffect(() => {
    const accessCookie = getCookie("ndienugu_member_verified");
    if (accessCookie === "true") {
      setIsAccessGranted(true);
    }
    setIsLoadingAccess(false); // Done checking cookie
  }, []);

  const handleAccessGranted = () => {
    setIsAccessGranted(true);
  };

  if (isLoadingAccess) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <p>Loading...</p> {/* Or a spinner component */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {isAccessGranted ? (
        <Feedwizard />
      ) : (
        <>
          <PageHeader
            title="Members Feed Access"
            description="Please enter the name and email used during your membership registration to access the feed."
          />
          <div className="md:w-7/12 mx-auto mt-8">
            <Memeberaccessform onAccessGranted={handleAccessGranted} />
          </div>
        </>
      )}
    </div>
  )
}