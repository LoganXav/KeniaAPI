import { z } from "zod";
import { breakPeriodCreateSchema } from "../../breakPeriod/validators/BreakPeriodCreateSchema";

export const termCreateSchema = z.object({
  id: z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
  name: z.string({ required_error: "Term name is required", invalid_type_error: "Term name must be a string" }).optional(),
  startDate: z.string({ required_error: "Term start date is required", invalid_type_error: "Term start date must be a string" }).optional(),
  endDate: z.string({ required_error: "Term end date is required", invalid_type_error: "Term end date must be a string" }).optional(),
  calendarId: z.number({ required_error: "Calendar ID is required", invalid_type_error: "Calendar ID must be a number" }).optional(),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).optional(),
  breakWeeks: z.array(breakPeriodCreateSchema).optional(),
});
