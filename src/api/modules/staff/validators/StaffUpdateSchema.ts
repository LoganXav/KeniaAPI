import * as z from "zod";
import { StaffEmploymentType } from "@prisma/client";

export const staffUpdateSchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  userId: z.number({ required_error: "Auth User Id is required" }),

  id: z.number({ required_error: "Staff User Id is required" }),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
  cvUrl: z.string().optional(),
  residentialCountryId: z.number().optional(),
  residentialAddress: z.string().optional(),
  residentialStateId: z.number().optional(),
  residentialLgaId: z.number().optional(),
  residentialZipCode: z.number().optional(),
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
  highestLevelEdu: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().optional(),
  dateOfBirth: z
    .string({
      invalid_type_error: "Date of birth must be a valid Date object",
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
      const date = new Date(val);
      return date;
    }),
  nin: z.string().optional(),
  tin: z.string().optional(),
  subjectIds: z.array(z.number().int("Subject ID must be an integer")).optional(),
});

export const staffUpdateManySchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  ids: z.array(
    z.number({
      required_error: "Argument ids is missing",
    })
  ),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
});
