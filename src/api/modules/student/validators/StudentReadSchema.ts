import { z } from "zod";

export const studentReadParamsSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
  ids: z.array(z.number()).optional(),
  studentId: z.string().optional(),
  userId: z.number().int("User ID must be an integer").optional(),
  classId: z.number().int("Class ID must be an integer").optional(),
  dormitoryId: z.number().int("Dormitory ID must be an integer").optional(),
  admissionNo: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const studentReadOneParamsSchema = z.object({
  id: z.number().int("Student ID must be an integer"),
  tenantId: z.number().int("Tenant ID must be an integer"),
});
