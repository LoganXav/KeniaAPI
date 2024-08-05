import { z } from "zod";

export const createStaffSchema = z.object({
  userId: z.number().int("User ID must be an integer").optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  roleId: z.number().int("Role list ID must be an integer").optional(),
  groupIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  classIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  subjectIds: z.array(z.number().int("Department ID must be an integer")).optional(),
});
