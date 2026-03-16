import z from "zod"

export const experienceItemSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  currentlyWorking: z.boolean().default(false),
  dateOfJoining: z.string(),
  dateOfRelieving: z.string().optional().nullable(),
  description: z.string(),
});

export const educationItemSchema = z.object({
  course: z.string(),
  branch: z.string(),
  startOfCourse: z.string(),
  endOfCourse: z.string(),
   university: z.string()
});

export const applyJobSchema = z.object({
  jobId: z.coerce.number(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  mobilePhone: z.string().min(10, "Valid phone number required"),
  dateOfBirth: z.string(),
  totalExperience: z.string(),
  currentSalary: z.string(),
  noticePeriod: z.coerce.number(),
  skills: z.string(),
  gender: z.string(),
  resumeUrl: z.string().min(1, "Resume is required"),
  storageProvider: z.string().min(1, "Storage provider is required"),
  experienceDetails: z.array(experienceItemSchema).default([]),
  educationDetails: z.array(educationItemSchema).default([]),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["New", "Screened", "Interviewing", "Offered", "Rejected"]),
});



export type ApplyJobSchemaType = z.infer<typeof applyJobSchema>;