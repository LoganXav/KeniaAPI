import { z } from "zod";

export const guardianReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  tenantId: z.number().optional(),
  studentIds: z.array(z.number()).optional(),
});
