import { z } from "zod";

export const tenantGradingStructureReadSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
  userId: z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
});
