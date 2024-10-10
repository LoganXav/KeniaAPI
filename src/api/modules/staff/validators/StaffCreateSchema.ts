import { z } from "zod";

export const createStaffSchema = z.object({
  userId: z.number().int("User ID must be an integer").optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  roleId: z.number().int("Role list ID must be an integer").optional(),
  groupIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  classIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  subjectIds: z.array(z.number().int("Department ID must be an integer")).optional(),
});

export const createStaffUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be no more than 15 digits long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  tenantId: z.number().positive("Tenant ID must be a positive number").optional(),
});

export const staffCriteriaSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  roleId: z.number().optional(),
  jobTitle: z.string().optional(),
  groupId: z.number().optional(),
  classId: z.number().optional(),
  subjectId: z.number().optional(),
});

export const updateStaffDataSchema = z.object({
  userId: z.number().optional(),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
  groupIds: z.array(z.number()).optional(),
  classIds: z.array(z.number()).optional(),
  subjectIds: z.array(z.number()).optional(),
});

export const getAndUpdateStaffSchema = z.object({
  criteria: staffCriteriaSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one criterion is required",
  }),
  data: updateStaffDataSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one data field is required",
  }),
});
