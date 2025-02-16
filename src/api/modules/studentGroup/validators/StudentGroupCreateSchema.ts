import { z } from "zod";

export const studentGroupCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tenantId: z.number().min(1, "Tenant ID is required"),
});
