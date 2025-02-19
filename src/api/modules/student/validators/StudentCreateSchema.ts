import { z } from "zod";

export const studentCreateSchema = z.object({
  userId: z.number().int("User ID must be an integer"),
  classId: z.number().int("Class ID must be an integer").optional(),
  admissionNo: z.string().optional(),
  languages: z.string().optional(),
  religion: z.string().optional(),
  bloodGroup: z.string().optional(),
  previousSchool: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const studentCreateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required" }).positive(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  gender: z.string(),
  dateOfBirth: z.date().optional(),
  residentialAddress: z.string().optional(),
  residentialLgaId: z.number().optional(),
  residentialStateId: z.number().optional(),
  residentialCountryId: z.number().optional(),
  residentialZipCode: z.number().optional(),

  classId: z.number().int("Class ID must be an integer").optional(),
  dormitoryId: z.number().int("Dormitory ID must be an integer").optional(),
  admissionNo: z.string().optional(),
  currentGrade: z.number().optional(),
  languages: z.string().optional(),
  religion: z.string().optional(),
  bloodGroup: z.string().optional(),
  previousSchool: z.string().optional(),
  enrollmentDate: z
    .date()
    .optional()
    .default(() => new Date()),
  isActive: z.boolean().optional().default(true),
});

export const studentCriteriaSchema = z.object({
  tenantId: z.number().int("Invalid tenantId"),
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  userId: z.number().int("User ID must be an integer").optional(),
  classId: z.number().int("Class ID must be an integer").optional(),
  admissionNo: z.string().optional(),
  dormitoryId: z.number().int("Dormitory ID must be an integer").optional(),
  isActive: z.boolean().optional(),
});
