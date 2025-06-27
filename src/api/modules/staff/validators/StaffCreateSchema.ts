import { z } from "zod";
import DateTimeUtils from "~/utils/DateTimeUtil";
import { StaffEmploymentType } from "@prisma/client";

export const staffCreateSchema = z.object({
  userId: z.number().int("User ID must be an integer").optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  roleId: z.number().int("Role list ID must be an integer").optional(),
  groupIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  classIds: z.array(z.number().int("Department ID must be an integer")).optional(),
  subjectIds: z.array(z.number().int("Department ID must be an integer")).optional(),
});

export const staffCreateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).positive("Tenant ID must be a positive number"),

  firstName: z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email address"),
  phoneNumber: z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }),
  gender: z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }),
  nin: z.string({ required_error: "Nin is required", invalid_type_error: "Nin must be a string" }),

  dateOfBirth: z
    .string({
      invalid_type_error: "Date of birth must be a valid Date string",
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date of birth format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      return DateTimeUtils.parseToISO(val);
    }),

  jobTitle: z.string({ required_error: "Job title is required", invalid_type_error: "Job title must be a string" }).min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  roleId: z.number({ required_error: "Role ID is required", invalid_type_error: "Role ID must be a number" }).positive("Role ID must be a positive number"),

  residentialAddress: z.string().optional(),
  residentialStateId: z.number({ invalid_type_error: "State ID must be a number" }).optional(),
  residentialLgaId: z.number({ invalid_type_error: "LGA ID must be a number" }).optional(),
  residentialCountryId: z.number({ invalid_type_error: "Country ID must be a number" }).optional(),
  residentialZipCode: z.number({ invalid_type_error: "Zip Code must be a number" }).optional(),

  employmentType: z.nativeEnum(StaffEmploymentType, { invalid_type_error: "Invalid employment type" }).optional(),

  startDate: z
    .string({
      invalid_type_error: "Start date must be a valid Date object",
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid start date format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      const date = new Date(val);
      return date;
    }),

  highestLevelEdu: z.string({ invalid_type_error: "Education level must be a string" }).optional(),
  cvUrl: z.string({ invalid_type_error: "CV URL must be a string" }).optional(),
});

export const staffCriteriaSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  roleId: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const staffBulkCreateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).positive("Tenant ID must be a positive number"),
  staffs: z.array(
    z.object({
      firstName: z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).min(1, "First name is required").max(50, "First name must be less than 50 characters"),
      lastName: z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
      email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email address"),
      phoneNumber: z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }),
      gender: z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }),
      nin: z.string({ required_error: "Nin is required", invalid_type_error: "Nin must be a string" }),
      jobTitle: z.string({ required_error: "Job title is required", invalid_type_error: "Job title must be a string" }).min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
    })
  ),
});
