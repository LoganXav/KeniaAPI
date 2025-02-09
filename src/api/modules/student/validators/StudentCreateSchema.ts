import { z } from "zod";

export const studentCreateSchema = z.object({
  userId: z.number().int("User ID must be an integer").optional(),
  classId: z.string().min(1, "Class ID is required"),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email("Invalid guardian email").optional(),
  admissionNo: z.string().optional(),
});

export const studentCreateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required" }).positive(),

  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  gender: z.string(),
  classId: z.string().min(1, "Class ID is required"),

  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(new Date(val).getTime()), { message: "Invalid date of birth format" })
    .transform((val) => (val ? new Date(val) : null)),

  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email("Invalid guardian email").optional(),
  admissionNo: z.string().optional(),

  residentialAddress: z.string().optional(),
  residentialStateId: z.number().optional(),
  residentialLgaId: z.number().optional(),
  residentialCountryId: z.number().optional(),
  residentialZipCode: z.number().optional(),
});

export const studentCriteriaSchema = z.object({
  tenantId: z.number().int("Invalid tenantId"),
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  userId: z.string().optional(),
  classId: z.string().optional(),
  admissionNo: z.string().optional(),
});
