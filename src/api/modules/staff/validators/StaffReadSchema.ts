import { z } from "zod";

export const staffReadParamsSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
  ids: z.array(z.string()).optional(),
  roleId: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const staffReadOneParamsSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
  id: z.string(),
});
