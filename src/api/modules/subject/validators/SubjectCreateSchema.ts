import { z } from "zod";

export const subjectCreateSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string().optional(),
  classDivisionIds: z.array(z.number()).optional(),
  staffIds: z.array(z.number()).optional(),
  classId: z.number({ required_error: "Class ID is required", invalid_type_error: "Class ID must be a number" }),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
