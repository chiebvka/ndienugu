"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"; // For submitting data
import { X, Plus, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner";

type Guest = {
  id: number
  name: string
  age: string
  sex: string
}

interface RegistrationFormThreeProps {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  autoOpen?: boolean;
}

export default function RegistrationFormThree({ 
  eventId, 
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  autoOpen = false
}: RegistrationFormThreeProps) {
  const [open, setOpen] = useState(autoOpen);
  const [registrantName, setRegistrantName] = useState("")
  const [registrantEmail, setRegistrantEmail] = useState("")
  const [registrantAge, setRegistrantAge] = useState("")
  const [registrantSex, setRegistrantSex] = useState("")
  const [guests, setGuests] = useState<Guest[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (autoOpen && !hasSubmitted) {
      setOpen(true);
    }
  }, [autoOpen, hasSubmitted]);

  const addGuest = () => {
    setGuests([...guests, { id: Date.now(), name: "", age: "", sex: "" }])
  }

  const removeGuest = (id: number) => {
    setGuests(guests.filter((guest) => guest.id !== id))
  }

  const updateGuest = (id: number, field: "name" | "age" | "sex", value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest)))
  }

  const resetForm = () => {
    setRegistrantName("");
    setRegistrantEmail("");
    setRegistrantAge("");
    setRegistrantSex("");
    setGuests([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    if (!registrantName.trim()) {
      toast.error("Please enter your name.");
      setIsSubmitting(false);
      return;
    }
    if (!registrantEmail.trim() || !/\S+@\S+\.\S+/.test(registrantEmail)) {
        toast.error("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
    }
    if (!registrantAge) {
      toast.error("Please select an age range for yourself.");
      setIsSubmitting(false);
      return;
    }
    for (const guest of guests) {
        if(!guest.name.trim()){
            toast.error(`Please enter a name for Guest ${guests.indexOf(guest) + 1}.`);
            setIsSubmitting(false);
            return;
        }
        if (!guest.age) {
            toast.error(`Please select an age range for Guest ${guests.indexOf(guest) + 1}.`);
            setIsSubmitting(false);
            return;
        }
    }

    const registrationData = {
      eventId,
      registrant: {
        name: registrantName,
        email: registrantEmail,
        age: registrantAge,
        sex: registrantSex,
      },
      additionalGuests: guests.map(g => ({
        id: g.id,
        name: g.name,
        age: g.age,
        sex: g.sex,
      })),
    }

    console.log("Submitting registration data:", registrationData);

    try {
      const response = await axios.post("/api/events", registrationData);
      console.log("Registration successful:", response.data);
      toast.success(response.data.message || "Registration interest submitted successfully!");
      setOpen(false);
      resetForm();
      setHasSubmitted(true);
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
      <Button onClick={() => {
        setOpen(true);
        setHasSubmitted(false);
      }} className="bg-enugu text-white hover:bg-enugu/90">
        Register Now
      </Button>

      <Sheet open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}>
        <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col"> {/* Use flex column */}
          <SheetHeader className="mb-4 px-6 pt-6">
            <SheetTitle>Register for: {eventTitle}</SheetTitle>
            {eventDate && ( 
              <SheetDescription className="pt-2" asChild>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{eventDate}</span>
                  </div>
                  {eventTime && eventTime !== "TBD" && <div className="flex items-center"> 
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
          
          <Separator />

          {/* Make form scrollable and grow */}
          <div className="flex-grow overflow-y-auto">
            <form id="registration-form" onSubmit={handleSubmit} className="space-y-6 p-6"> 
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Information</h3>
                <div>
                  <Label htmlFor="registrantName">Name</Label>
                  <Input
                    id="registrantName"
                    type="text"
                    value={registrantName}
                    onChange={(e) => setRegistrantName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Your Full Name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="registrantEmail">Email</Label>
                  <Input
                    id="registrantEmail"
                    type="email"
                    value={registrantEmail}
                    onChange={(e) => setRegistrantEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="registrantAge">Age</Label>
                   <Select value={registrantAge} onValueChange={setRegistrantAge} required disabled={isSubmitting}>
                      <SelectTrigger id="registrantAge" className="mt-1">
                          <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="1-12">1-12</SelectItem>
                          <SelectItem value="13-17">13-17</SelectItem>
                          <SelectItem value="18+">18+</SelectItem>
                      </SelectContent>
                  </Select>
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
                      <Label htmlFor={`guestName-${guest.id}`}>Name</Label>
                      <Input
                        id={`guestName-${guest.id}`}
                        type="text"
                        value={guest.name}
                        onChange={(e) => updateGuest(guest.id, "name", e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Guest's Full Name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guestAge-${guest.id}`}>Age</Label>
                      <Select value={guest.age} onValueChange={(value) => updateGuest(guest.id, "age", value)} required disabled={isSubmitting}>
                          <SelectTrigger id={`guestAge-${guest.id}`} className="mt-1">
                              <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="1-12">1-12</SelectItem>
                              <SelectItem value="13-17">13-17</SelectItem>
                              <SelectItem value="18+">18+</SelectItem>
                          </SelectContent>
                      </Select>
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
                          <RadioGroupItem value="male" id={`male-${guest.id}`} />
                          <Label htmlFor={`male-${guest.id}`}>Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id={`female-${guest.id}`} />
                          <Label htmlFor={`female-${guest.id}`}>Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}

                {guests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">No additional guests added.</p>
                )}
              </div>
            </form>
          </div>

          <SheetFooter className="border-t p-4">
            <Button type="submit" form="registration-form" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}