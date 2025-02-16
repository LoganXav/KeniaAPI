import { z } from "zod";

export const classDivisionReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  classId: z.number().optional(),
  tenantId: z.number().optional(),
});
