import { z } from "zod";

export const guardianUpdateSchema = z.object({
  userId: z.number({ required_error: "User ID is required", invalid_type_error: "User ID must be a number" }),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
  firstName: z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).optional(),
  lastName: z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).optional(),
  phoneNumber: z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }).optional(),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).optional(),
  gender: z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }).optional(),
  dateOfBirth: z.string({ required_error: "Date of birth is required", invalid_type_error: "Date of birth must be a string" }).optional(),
  residentialAddress: z.string({ required_error: "Residential address is required", invalid_type_error: "Residential address must be a string" }).optional(),
  residentialStateId: z.number({ required_error: "Residential state ID is required", invalid_type_error: "Residential state ID must be a number" }).optional(),
  residentialLgaId: z.number({ required_error: "Residential LGA ID is required", invalid_type_error: "Residential LGA ID must be a number" }).optional(),
  residentialCountryId: z.number({ required_error: "Residential country ID is required", invalid_type_error: "Residential country ID must be a number" }).optional(),
  residentialZipCode: z.string({ required_error: "Residential zip code is required", invalid_type_error: "Residential zip code must be a string" }).optional(),
  studentIds: z.array(z.number({ required_error: "Student IDs are required", invalid_type_error: "Student IDs must be an array of numbers" })).optional(),
});
