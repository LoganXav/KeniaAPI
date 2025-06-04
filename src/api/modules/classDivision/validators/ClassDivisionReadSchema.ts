import { z } from "zod";

export const classDivisionReadSchema = z.object({
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
