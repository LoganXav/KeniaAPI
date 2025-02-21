import { z } from "zod";

export const studentCreateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).positive("Tenant ID must be a positive number"),

  // Personal Information
  firstName: z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email address"),
  phoneNumber: z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }),
  gender: z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }),
  religion: z.string({ invalid_type_error: "Religion must be a string" }).optional(),
  bloodGroup: z.string({ invalid_type_error: "Blood group must be a string" }).optional(),
  dateOfBirth: z
    .string({
      required_error: "Date of birth is required",
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

  residentialAddress: z.string({ invalid_type_error: "Residential address must be a string" }).optional(),
  residentialLgaId: z.number({ invalid_type_error: "LGA ID must be a number" }).optional(),
  residentialStateId: z.number({ invalid_type_error: "State ID must be a number" }).optional(),
  residentialCountryId: z.number({ invalid_type_error: "Country ID must be a number" }).optional(),
  residentialZipCode: z.number({ invalid_type_error: "Zip Code must be a number" }).optional(),

  // Guardians Information
  guardians: z.array(
    z.object({
      firstName: z.string({ required_error: "Guardian first name is required", invalid_type_error: "Guardian first name must be a string" }).min(1, "Guardian first name is required"),
      lastName: z.string({ required_error: "Guardian last name is required", invalid_type_error: "Guardian last name must be a string" }).min(1, "Guardian last name is required"),
      email: z.string({ required_error: "Guardian email is required", invalid_type_error: "Guardian email must be a string" }).email("Invalid guardian email address"),
      phoneNumber: z.string({ required_error: "Guardian phone number is required", invalid_type_error: "Guardian phone number must be a string" }),
      gender: z.string({ invalid_type_error: "Guardian gender must be a string" }).optional(),
      dateOfBirth: z
        .string({
          invalid_type_error: "Guardian date of birth must be a valid Date object",
        })
        .optional()
        .refine(
          (val) => {
            if (!val) return true;
            const date = new Date(val);
            return !isNaN(date.getTime());
          },
          {
            message: "Invalid guardian date of birth format",
          }
        )
        .transform((val) => {
          if (!val) return null;
          const date = new Date(val);
          return date;
        }),
      residentialAddress: z.string({ required_error: "Guardian residential address is required", invalid_type_error: "Guardian residential address must be a string" }),
      residentialLgaId: z.number({ required_error: "Guardian LGA ID is required", invalid_type_error: "Guardian LGA ID must be a number" }),
      residentialStateId: z.number({ required_error: "Guardian state ID is required", invalid_type_error: "Guardian state ID must be a number" }),
      residentialCountryId: z.number({ required_error: "Guardian country ID is required", invalid_type_error: "Guardian country ID must be a number" }),
      residentialZipCode: z.number({ required_error: "Guardian zip code is required", invalid_type_error: "Guardian zip code must be a number" }),
    })
  ),

  // Admission Information
  classId: z.number({ invalid_type_error: "Class ID must be a number" }).int("Class ID must be an integer").optional(),
  dormitoryId: z.number({ invalid_type_error: "Dormitory ID must be a number" }).int("Dormitory ID must be an integer").optional(),
  studentGroupIds: z.array(z.number({ invalid_type_error: "Student Group ID must be a number" }).int("Student Group ID must be an integer")).optional(),
  enrollmentDate: z
    .string({
      required_error: "Enrollment date is required",
      invalid_type_error: "Enrollment date must be a valid Date object",
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid enrollment date format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      const date = new Date(val);
      return date;
    }),
});

export const studentCriteriaSchema = z.object({
  tenantId: z.number().int("Invalid tenantId"),
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  classId: z.number().int("Class ID must be an integer").optional(),
  dormitoryId: z.number().int("Dormitory ID must be an integer").optional(),
});
