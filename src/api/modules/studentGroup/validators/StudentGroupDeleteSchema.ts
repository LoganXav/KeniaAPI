import { z } from "zod";

export const studentGroupDeleteSchema = z.object({
  id: z.number({
    required_error: "Student Group ID is required",
    invalid_type_error: "Student Group ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
