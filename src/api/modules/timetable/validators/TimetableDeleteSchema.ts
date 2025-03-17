import { z } from "zod";

export const timetableDeleteSchema = z.object({
  id: z.number({
    required_error: "Timetable ID is required",
    invalid_type_error: "Timetable ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
