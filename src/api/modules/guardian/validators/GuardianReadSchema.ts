import { z } from "zod";

export const guardianReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  tenantId: z.number().optional(),
});
