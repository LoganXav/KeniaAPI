import { z } from "zod";

export const schoolCalendarReadSchema = z.object({
  userId: z.number().optional(),
  id: z.number().optional(),
  year: z.number().optional(),
  tenantId: z.number().optional(),
});
