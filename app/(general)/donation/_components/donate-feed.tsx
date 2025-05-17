"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

type Props = {}

export default function Donatefeed({}: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="relative bg-[url('https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byv3VmpAXZVrdy734DGxg1OTqXSeWPJsKQBoI9')] bg-cover bg-center py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10 mx-auto px-4 text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Support Our Community</h1>
          <p className="text-sm md:text-lg max-w-2xl">
            Your generous donations help us foster unity, preserve our cultural heritage, and support development
            initiatives both in Scotland and Enugu.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Donation Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="bg-green-600 text-white">
                <CardTitle>Why Donate?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <path d="M12 2v20" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Community Projects</h3>
                      <p className="text-gray-600">
                        Fund initiatives that benefit our community both in Scotland and Enugu.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <path d="M17 6.1H3" />
                        <path d="M21 12.1H3" />
                        <path d="M15.1 18H3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Cultural Events</h3>
                      <p className="text-gray-600">
                        Support cultural celebrations that preserve our heritage and traditions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Education Support</h3>
                      <p className="text-gray-600">
                        Help fund scholarships and educational programs for our community members.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>+44 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>donations@ndienugu.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation Form */}
          <div className="md:col-span-2 mt-6 md:mt-0">
            <Card>
              <CardHeader className="bg-green-600 text-white">
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription className="text-green-100">Choose your preferred donation method</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="w-full">
                  <h3>Bank Transfer</h3>
                  <div className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-lg mb-2">Bank Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Account Name</p>
                            <p className="font-medium">Ndi Enugu Scotland</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Bank</p>
                            <p className="font-medium">Bank of Scotland</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="font-medium">25417366</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sort Code</p>
                            <p className="font-medium">80-22-60</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Reference</p>
                            <p className="font-medium">DONATION-[YOUR NAME]</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 hover:bg-enugu/30"
                    onClick={() => {
                      navigator.clipboard.writeText('Ndi Enugu Scotland');
                      toast.success('Account name copied to clipboard');
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Account Name
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 hover:bg-enugu/30"
                    onClick={() => {
                      navigator.clipboard.writeText('25417366');
                      toast.success('Account number copied to clipboard');
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Account Number
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 hover:bg-enugu/30"
                    onClick={() => {
                      navigator.clipboard.writeText('80-22-60');
                      toast.success('Sort code copied to clipboard');
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Sort Code
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-600"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" x2="12" y1="9" y2="13" />
                  <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
                Tax Deductible Information
              </h3>
              <p className="text-gray-700">
                Donations to Ndi Enugu Scotland Association may be eligible for Gift Aid if you are a UK taxpayer. This
                means we can claim an extra 25p for every £1 you donate at no cost to you. Please contact us for a Gift
                Aid declaration form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}