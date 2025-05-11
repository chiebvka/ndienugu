"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"; // For submitting data
import { X, Plus, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner";

type Guest = {
  id: number
  age: string
  sex: string
}

interface RegistrationFormThreeProps {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
}

export default function RegistrationFormThree({ 
  eventId, 
  eventTitle,
  eventDate,
  eventTime,
  eventLocation 
}: RegistrationFormThreeProps) {
  const [open, setOpen] = useState(false)
  const [registrantAge, setRegistrantAge] = useState("")
  const [registrantSex, setRegistrantSex] = useState("")
  const [guests, setGuests] = useState<Guest[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addGuest = () => {
    setGuests([...guests, { id: Date.now(), age: "", sex: "" }])
  }

  const removeGuest = (id: number) => {
    setGuests(guests.filter((guest) => guest.id !== id))
  }

  const updateGuest = (id: number, field: "age" | "sex", value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest)))
  }

  const resetForm = () => {
    setRegistrantAge("");
    setRegistrantSex("");
    setGuests([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    const registrationData = {
      eventId,
      registrant: {
        age: registrantAge,
        sex: registrantSex,
      },
      additionalGuests: guests,
    }

    console.log("Submitting registration data:", registrationData);

    try {
      const response = await axios.post("/api/events", registrationData);
      console.log("Registration successful:", response.data);
      toast.success(response.data.message || "Registration interest submitted successfully!");
      setOpen(false); // Close sheet on success
      resetForm(); // Reset form fields
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data?.error || error.response.statusText || 'Server error'}`);
      } else {
        toast.error("Registration failed: An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-enugu text-white hover:bg-enugu/90">
        Register Now
      </Button>

      <Sheet open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm(); // Reset form if sheet is closed without submitting
      }}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto"> {/* Adjusted width */}
          <SheetHeader className="mb-4">
            <SheetTitle>Register for: {eventTitle}</SheetTitle>
            {eventDate && ( 
              <SheetDescription className="pt-2" asChild>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{eventDate}</span>
                  </div>
                  {eventTime && <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{eventTime}</span>
                  </div>}
                  {eventLocation && <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{eventLocation}</span>
                  </div>}
                </div>
              </SheetDescription>
            )}
          </SheetHeader>
          
          <Separator className="my-4" />

          <form onSubmit={handleSubmit} className="space-y-6 pb-16"> {/* Added padding-bottom for footer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Information</h3>
              <div>
                <Label htmlFor="registrantAge">Age</Label>
                <Input
                  id="registrantAge"
                  type="number"
                  value={registrantAge}
                  onChange={(e) => setRegistrantAge(e.target.value)}
                  required
                  min="0"
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Sex</Label>
                <RadioGroup value={registrantSex} onValueChange={setRegistrantSex} className="flex gap-4 mt-1" disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Additional Guests</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGuest}
                  className="flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" /> Add Guest
                </Button>
              </div>

              {guests.map((guest, index) => (
                <div key={guest.id} className="border p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Guest {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon" // Made it icon button for cleaner look
                      onClick={() => removeGuest(guest.id)}
                      className="h-7 w-7 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                      disabled={isSubmitting}
                      aria-label="Remove guest"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor={`guest-age-${guest.id}`}>Age</Label>
                    <Input
                      id={`guest-age-${guest.id}`}
                      type="number"
                      value={guest.age}
                      onChange={(e) => updateGuest(guest.id, "age", e.target.value)}
                      required
                      min="0"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label>Sex</Label>
                    <RadioGroup
                      value={guest.sex}
                      onValueChange={(value) => updateGuest(guest.id, "sex", value)}
                      className="flex gap-4 mt-1"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id={`guest-male-${guest.id}`} />
                        <Label htmlFor={`guest-male-${guest.id}`}>Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id={`guest-female-${guest.id}`} />
                        <Label htmlFor={`guest-female-${guest.id}`}>Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              ))}

              {guests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No additional guests added.</p>
              )}
            </div>

            <SheetFooter className="fixed bottom-0 right-0 left-0 bg-background border-t p-4 sm:relative sm:bg-transparent sm:border-none sm:p-0"> {/* Sticky footer for mobile */}
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-enugu text-white hover:bg-enugu/90" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
} 