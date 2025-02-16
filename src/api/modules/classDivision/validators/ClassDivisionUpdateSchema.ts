import { z } from "zod";

export const classDivisionUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  classId: z.number().optional(),
  tenantId: z.number().optional(),
});
