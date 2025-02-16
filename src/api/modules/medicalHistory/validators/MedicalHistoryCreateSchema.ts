import { z } from "zod";

export const medicalHistoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  studentId: z.number().min(1, "Student ID is required"),
  tenantId: z.number().min(1, "Tenant ID is required"),
});
