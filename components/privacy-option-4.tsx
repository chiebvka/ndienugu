"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

export default function PrivacyOption4() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const handleDismiss = () => {
    localStorage.setItem('privacyModalSeen', 'true');
    setIsVisible(false);
  };

  const steps = [
    {
      title: "Welcome to NESA Privacy Center",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Your Privacy Matters</h2>
          <p className="text-gray-600">
            We're committed to transparency about how we collect and use your data. Let us walk you through our privacy
            practices.
          </p>
        </div>
      ),
    },
    {
      title: "Event Registration Data",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">What we collect:</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Your name</li>
              <li>• Your email address</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Why we collect it:</h3>
            <p className="text-sm text-gray-600">
              To send you event confirmations, updates, and important information about NESA events you've registered
              for.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Membership Registration",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">What we collect:</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Your name</li>
              <li>• Your email address</li>
              <li>• Your Local Government Area (LGA)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Why we collect it:</h3>
            <p className="text-sm text-gray-600">
              To organize our community effectively and provide relevant local information and services.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Cookie Usage",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Member Access Cookies:</h3>
            <p className="text-sm text-green-700">
              Stored for 30 days to provide seamless access to the members-only content feed.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">GDPR Compliance:</h3>
            <p className="text-sm text-blue-700">
              We only collect data necessary for our services and with your explicit consent.
            </p>
          </div>
        </div>
      ),
    },
  ]

  if (!isVisible) return null

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h2>
          {steps[currentStep].content}
        </div>

        <div className="p-6 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleDismiss} className="bg-green-600 hover:bg-green-700">
              I Understand
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
