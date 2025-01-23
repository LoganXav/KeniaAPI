import { z } from "zod";

export const TenantReadSchema = z.object({
  tenantId: z.string({
    required_error: "Tenant Id is required",
  }),
});
