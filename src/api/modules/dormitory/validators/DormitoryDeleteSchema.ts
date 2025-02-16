import { z } from "zod";

export const dormitoryDeleteSchema = z.object({
  id: z.number({
    required_error: "Dormitory ID is required",
    invalid_type_error: "Dormitory ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
