import { z } from "zod";

export const guardianCreateSchema = z.object({
  firstName: z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  phoneNumber: z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email address"),
  gender: z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }).optional(),
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

  // Address
  residentialAddress: z.string(),
  residentialStateId: z.number({ invalid_type_error: "State ID must be a number" }),
  residentialLgaId: z.number({ invalid_type_error: "LGA ID must be a number" }),
  residentialCountryId: z.number({ invalid_type_error: "Country ID must be a number" }),
  residentialZipCode: z.number({ invalid_type_error: "Zip Code must be a number" }),

  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).positive("Tenant ID must be a positive number"),
  studentIds: z.array(z.number().int("Student ID must be an integer")).optional(),
});
