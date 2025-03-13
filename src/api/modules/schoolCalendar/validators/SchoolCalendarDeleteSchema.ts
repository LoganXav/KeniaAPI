import { z } from "zod";

export const schoolCalendarDeleteSchema = z.object({
  id: z.number({
    required_error: "School Calendar ID is required",
    invalid_type_error: "School Calendar ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
