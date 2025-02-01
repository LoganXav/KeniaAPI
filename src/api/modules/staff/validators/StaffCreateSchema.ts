import { z } from "zod";

export const staffCreateSchema = z.object({
  userId: z.number().int("User ID must be an integer").optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  roleId: z.number().int("Role list ID must be an integer").optional(),
  groupIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  classIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  subjectIds: z.array(z.number().int("Department ID must be an integer")).optional(),
});

export const staffCreateRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),

  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Invalid email address"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be no more than 15 digits long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .optional(),

  jobTitle: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),

  roleId: z.number().positive("Role ID must be a positive number"),

  tenantId: z.number().positive("Tenant ID must be a positive number"),

  address: z.string().optional(),

  stateId: z.number().optional(),
  lgaId: z.number().optional(),
  countryId: z.number().optional(),

  zipCode: z.number().optional(),

  postalCode: z.string().optional(),

  employmentType: z.string().optional(),

  startDate: z.string().datetime().optional(),

  nin: z.string().optional(),
  tin: z.string().optional(),
  highestLevelEdu: z.string().optional(),
  cvUrl: z.string().url("Invalid CV URL").optional(),
});

export const staffCriteriaSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  roleId: z.string().optional(),
  jobTitle: z.string().optional(),
  groupId: z.string().optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
});
