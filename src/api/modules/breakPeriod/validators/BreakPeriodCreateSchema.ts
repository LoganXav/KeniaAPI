import { z } from "zod";

export const breakPeriodCreateSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  termId: z.number().optional(),
  tenantId: z.number().optional(),
});
