import { z } from "zod";

export const studentGroupUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  tenantId: z.number().optional(),
});
