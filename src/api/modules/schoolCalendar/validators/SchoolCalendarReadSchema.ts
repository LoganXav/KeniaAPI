import { z } from "zod";

export const schoolCalendarReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  year: z.number().optional(),
  tenantId: z.number().optional(),
});
