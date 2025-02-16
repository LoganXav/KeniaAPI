import { z } from "zod";

export const medicalHistoryDeleteSchema = z.object({
  id: z.number({
    required_error: "Medical History ID is required",
    invalid_type_error: "Medical History ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
