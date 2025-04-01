import { z } from "zod";

export const subjectTemplateSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
});
