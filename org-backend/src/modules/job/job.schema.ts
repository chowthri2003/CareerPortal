import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(2, "Location is required"),
  experienceRequired: z.string().min(1, "Experience info is required"),
  workMode: z.enum(["On-site", "Hybrid", "Remote"]),
  jobType: z.enum(["Full-time", "Contract", "Internship"]),
  roleOverview: z.string().min(10, "Provide a role overview"),
  keyRequirements: z.string().min(10, "Key requirements are required"),
  coreRequirements: z.string().min(10, "Core requirements are required"),
});

export const updateJobStatusSchema = z.object({
  status: z.enum(["Posted", "Draft", "Position Filled"]),
});

export type CreateJobInput = z.input<typeof createJobSchema>;