"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

export default function IssueSubmission() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "",
    description: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Reset form and show success message
    setFormState({
      name: "",
      email: "",
      topic: "",
      description: "",
    })
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <section className="py-12">
      <div className="bg-secondary rounded-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Submit an Issue for Discussion</h2>
        <p className="text-gray-700 mb-8">
          Have a concern or topic you'd like our organization to address at our next meeting? Submit your issue using
          the form below, and our board will review it for inclusion in the agenda.
        </p>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start">
            <CheckCircle className="text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Issue Submitted Successfully</h3>
              <p className="text-green-700">
                Thank you for your submission. Your issue has been received and will be reviewed by our team for
                discussion at the next meeting.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formState.topic}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief title for your issue"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Please provide details about the issue you'd like to be discussed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

