import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "hr"]).optional(),
  isActive: z.boolean().optional(),
});