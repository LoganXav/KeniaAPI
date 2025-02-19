import { z } from "zod";

export const guardianUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email("Invalid email format").optional(),
  address: z.string().min(1).optional(),
  studentIds: z.array(z.number().int("Student ID must be an integer")).optional(),
  tenantId: z.number().optional(),
});
