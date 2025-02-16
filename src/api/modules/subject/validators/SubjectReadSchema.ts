import { z } from "zod";

export const subjectReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  classId: z.number().optional(),
  tenantId: z.number().optional(),
});
