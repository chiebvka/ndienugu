"use client"

import React, { useState } from 'react';
// Removed useRouter as we will handle display toggle in the parent
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Props = {
  onAccessGranted: () => void;
}

// Function to set a cookie
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export default function Memeberaccessform({ onAccessGranted }: Props) {
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    // const router = useRouter() // No longer needed here
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
  
      if (!firstName.trim() || !email.trim()) {
        toast.error("Please enter both your first name and email")
        return
      }
  
      setIsLoading(true)
  
      try {
        const response = await fetch("/api/members/feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, email }),
        });
  
        const data = await response.json();
  
        if (response.ok) { // Status 200
          toast.success(data.message || "Access granted! Welcome to the member feed.");
          setCookie("ndienugu_member_verified", "true", 30); // Set cookie for 30 days
          onAccessGranted(); // Notify parent component
        } else {
          // Handle specific error messages from the API (400, 403, 429)
          toast.error(
            data.message || "An error occurred. Please try again."
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Failed to verify access. Please check your connection and try again.");
      } finally {
        setIsLoading(false)
      }
    }

  return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name (used during registration)</Label>
                <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                />
            </div>

            <Button type="submit" className="w-full bg-enugu hover:bg-enugu/90" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Member Feed"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                Only registered members can access the feed. If you&apos;re having trouble, please contact support.
            </p>
        </form>
  )
}