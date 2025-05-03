import z from "zod";
// Define validation schema for each step
export const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dobDay: z.string().min(1, "Day is required"),
    dobMonth: z.string().min(1, "Month is required"),
    dobYear: z.string().min(1, "Year is required"),
  })
  
  export const contactInfoSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    mobile: z
      .string()
      .min(11, "Mobile number must be at least 11 digits")
      .regex(/^[0-9+]+$/, "Mobile number must contain only digits"),
  })
  
  export const locationInfoSchema = z.object({
    address: z.string().min(10, "Address must be at least 10 characters"),
    lga: z.string().min(1, "Please select your Local Government Area"),
  })
  
  export  const profileInfoSchema = z.object({
    bio: z.string().min(20, "Bio must be at least 20 characters").max(500, "Bio cannot exceed 500 characters"),
  })