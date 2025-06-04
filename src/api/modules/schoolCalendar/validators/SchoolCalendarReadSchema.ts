import { z } from "zod";

export const schoolCalendarReadSchema = z.object({
  userId: z.number(),
  year: z.number(),
  tenantId: z.number(),
});
