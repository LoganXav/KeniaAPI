import { z } from "zod";
import { breakPeriodCreateSchema } from "../../breakPeriod/validators/BreakPeriodCreateSchema";

export const termCreateSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  calendarId: z.number().optional(),
  tenantId: z.number().optional(),
  breakWeeks: z.array(breakPeriodCreateSchema).optional(),
});
