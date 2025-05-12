"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, CheckCircle, User, Mail, MapPin, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { contactInfoSchema, locationInfoSchema, profileInfoSchema } from '@/lib/validation/memeber';
import { toast } from 'sonner';
import axios from 'axios';


const lgas = [
    "Aninri",
    "Awgu",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Etiti",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Oji River",
    "Udenu",
    "Udi",
    "Uzo Uwani",
  ]


  // Define the personal info schema part matching the API route
  const adjustedPersonalInfoSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    dobDay: z.string().nonempty("Day is required"),
    dobMonth: z.string().nonempty("Month is required"),
    // dobYear removed
  });
  
  // Combine all schemas
const formSchema = adjustedPersonalInfoSchema.merge(contactInfoSchema).merge(locationInfoSchema).merge(profileInfoSchema)

// Type for our form data matching the combined schema
type FormData = z.infer<typeof formSchema>
type Props = {}

export default function Membershipform({}: Props) {

    const [currentStep, setCurrentStep] = useState(1)
    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Initialize form with React Hook Form and Zod resolver
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        // Default values match the FormData type
        defaultValues: {
            firstName: "",
            lastName: "",
            dobDay: "",
            dobMonth: "",
            email: "",
            mobile: "",
            address: "",
            lga: "",
            bio: "",
        },
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        // watch, // 'watch' is removed as it's not used in the provided snippet below
    } = methods

    // Generate arrays for days and months (Years array removed)
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]
    // const years removed

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)

        // Data directly matches the FormData type, no extra formatting needed here
        const formattedData = data;
        console.log("Submitting data:", formattedData); // Log data being sent

        try {
            const response = await axios.post('/api/members', formattedData)
            toast.success('Application submitted successfully! 🎉')
            setIsComplete(true)
        } catch (err: any) {
            // More specific error handling from API response
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.';
            const errorDetails = err.response?.data?.details;
            console.error("Submission Error:", err.response?.data || err.message);
            toast.error(errorMessage, {
                description: errorDetails ? JSON.stringify(errorDetails) : undefined,
            });
        } finally {
            setIsLoading(false)
        }
    }

    // Handle next step with validation
    const handleNextStep = async () => {
        let fieldsToValidate: (keyof FormData)[] = [] // Use keyof FormData for type safety

        switch (currentStep) {
            case 1:
                // Validate the fields for the first step
                fieldsToValidate = ["firstName", "lastName", "dobDay", "dobMonth"]
                break
            case 2:
                fieldsToValidate = ["email", "mobile"]
                break
            case 3:
                fieldsToValidate = ["address", "lga"]
                break
            case 4:
                fieldsToValidate = ["bio"]
                break
        }

        const isStepValid = await trigger(fieldsToValidate)

        if (isStepValid) {
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1)
            } else {
                // Trigger final submission
                handleSubmit(onSubmit)();
            }
        } else {
             console.log("Validation errors:", errors); // Log validation errors if step is invalid
        }
    }

    // Handle previous step
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    // Watch calls removed as they weren't used in the calculation logic anymore

    return (
        <>
            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardContent className="p-6">
                    {!isComplete ? (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Progress Indicator */}
                                <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div className={`flex items-center ${currentStep >= 1 ? "text-[#00A651]" : "text-gray-400"}`}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? "border-[#00A651] bg-[#00A651]/10" : "border-gray-300"}`}
                                    >
                                        <User className="h-5 w-5" />
                                    </div>
                                    <span className="ml-2 hidden sm:inline">Personal</span>
                                    </div>
                                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                                    <div
                                        className={`h-full bg-[#00A651] ${currentStep >= 2 ? "w-full" : "w-0"} transition-all duration-300`}
                                    ></div>
                                    </div>
                                    <div className={`flex items-center ${currentStep >= 2 ? "text-[#00A651]" : "text-gray-400"}`}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? "border-[#00A651] bg-[#00A651]/10" : "border-gray-300"}`}
                                    >
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <span className="ml-2 hidden sm:inline">Contact</span>
                                    </div>
                                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                                    <div
                                        className={`h-full bg-[#00A651] ${currentStep >= 3 ? "w-full" : "w-0"} transition-all duration-300`}
                                    ></div>
                                    </div>
                                    <div className={`flex items-center ${currentStep >= 3 ? "text-[#00A651]" : "text-gray-400"}`}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? "border-[#00A651] bg-[#00A651]/10" : "border-gray-300"}`}
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <span className="ml-2 hidden sm:inline">Location</span>
                                    </div>
                                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                                    <div
                                        className={`h-full bg-[#00A651] ${currentStep >= 4 ? "w-full" : "w-0"} transition-all duration-300`}
                                    ></div>
                                    </div>
                                    <div className={`flex items-center ${currentStep >= 4 ? "text-[#00A651]" : "text-gray-400"}`}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? "border-[#00A651] bg-[#00A651]/10" : "border-gray-300"}`}
                                    >
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <span className="ml-2 hidden sm:inline">Profile</span>
                                    </div>
                                </div>
                                </div>

                                {/* Step Content */}
                                <div className="py-4">
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-[#00A651]">Personal Information</h2>
                                    <p className="text-gray-600 mb-6">Please provide your personal details</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            render={({ field }) => <Input id="firstName" placeholder="Enter first name" {...field} />}
                                        />
                                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            render={({ field }) => <Input id="lastName" placeholder="Enter last name" {...field} />}
                                        />
                                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        {/* Ensure grid cols match number of fields */}
                                        <div className="grid grid-cols-2 gap-2"> {/* Changed to grid-cols-2 */}
                                            <div>
                                                <Controller
                                                    name="dobDay" // Correct name
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className={errors.dobDay ? "border-red-500" : ""}>
                                                                <SelectValue placeholder="Day" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {days.map((day) => (
                                                                    <SelectItem key={day} value={day}>
                                                                        {day}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.dobDay && <p className="text-sm text-red-500">{errors.dobDay.message}</p>}
                                            </div>
                                            <div>
                                                <Controller
                                                    name="dobMonth" // Correct name
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className={errors.dobMonth ? "border-red-500" : ""}>
                                                                <SelectValue placeholder="Month" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {months.map((month, index) => ( // Use month name for display and value
                                                                    <SelectItem key={month} value={month}>
                                                                        {month}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.dobMonth && <p className="text-sm text-red-500">{errors.dobMonth.message}</p>}
                                            </div>
                                            {/* Year Select is correctly removed */}
                                        </div>
                                    </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-[#00A651]">Contact Information</h2>
                                    <p className="text-gray-600 mb-6">How can we reach you?</p>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input id="email" type="email" placeholder="Enter your email address" {...field} />
                                        )}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Controller
                                        name="mobile"
                                        control={control}
                                        render={({ field }) => (
                                            <Input id="mobile" placeholder="Enter your mobile number" {...field} />
                                        )}
                                        />
                                        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
                                    </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-[#00A651]">Location Information</h2>
                                    <p className="text-gray-600 mb-6">Where are you located in Enugu State?</p>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea id="address" placeholder="Enter your full address" {...field} />
                                        )}
                                        />
                                        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lga">Local Government Area</Label>
                                        <Controller
                                        name="lga"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.lga ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select your LGA" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lgas.map((lga) => (
                                                <SelectItem key={lga} value={lga}>
                                                    {lga}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                        )}
                                        />
                                        {errors.lga && <p className="text-sm text-red-500">{errors.lga.message}</p>}
                                    </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-[#00A651]">About You</h2>
                                    <p className="text-gray-600 mb-6">Tell us more about yourself</p>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Short Bio</Label>
                                        <Controller
                                        name="bio"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself and why you'd like to join our community"
                                            className="min-h-[150px]"
                                            {...field}
                                            />
                                        )}
                                        />
                                        {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
                                    </div>
                                    </div>
                                )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8">
                                {currentStep > 1 ? (
                                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                    </Button>
                                ) : (
                                    <div></div>
                                )}

                                <Button
                                type="button" // Always type="button" here, handleSubmit controls submission
                                onClick={handleNextStep} // Use handleNextStep which calls handleSubmit on final step
                                className="bg-[#00A651] hover:bg-[#008540]"
                                disabled={isLoading}
                                >
                                {isLoading && currentStep === 4 ? 'Submitting...' : currentStep < 4 ? (
                                    <>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </>
                                ) : (
                                    "Submit Application" // Clearer text for final step
                                )}
                                </Button>
                                </div>
                            </form>
                        </FormProvider>
                    ) : (
                        <div className="py-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-[#00A651]/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="h-10 w-10 text-[#00A651]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#00A651] mb-4">Registration Complete!</h2>
                        <p className="text-gray-600 mb-8">
                            Thank you for registering your interest in becoming a member. We will review your application and
                            contact you soon.
                        </p>
                        <Button onClick={() => { setIsComplete(false); setCurrentStep(1); }} variant="outline">
                            Register Another Member
                        </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}