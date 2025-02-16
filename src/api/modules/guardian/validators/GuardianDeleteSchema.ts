import { z } from "zod";

export const guardianDeleteSchema = z.object({
  id: z.number({
    required_error: "Guardian ID is required",
    invalid_type_error: "Guardian ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
