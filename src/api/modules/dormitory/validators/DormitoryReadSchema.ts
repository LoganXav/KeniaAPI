import { z } from "zod";

export const dormitoryReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  tenantId: z.number().optional(),
});
