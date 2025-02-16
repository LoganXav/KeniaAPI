import { z } from "zod";

export const studentGroupReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  tenantId: z.number().optional(),
});
