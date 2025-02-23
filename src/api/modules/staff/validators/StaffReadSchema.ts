import { z } from "zod";

export const staffReadParamsSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
  userId: z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
  ids: z.array(z.string()).optional(),

  jobTitle: z.string().optional(),
});

export const staffReadOneParamsSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
  userId: z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
});
