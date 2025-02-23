import { z } from "zod";

export const studentReadSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
  userId: z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
  ids: z.array(z.number()).optional(),
  classId: z.number({ invalid_type_error: "Class ID must be an integer" }).optional(),
  dormitoryId: z.number({ invalid_type_error: "Dormitory ID must be an integer" }).optional(),
});

export const studentReadOneParamsSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
  userId: z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
});
