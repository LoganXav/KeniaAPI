import { z } from "zod";

export const subjectUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  classId: z.number().optional(),
  tenantId: z.number().optional(),
});
