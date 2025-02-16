import { z } from "zod";

export const medicalHistoryUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  studentId: z.number().optional(),
  tenantId: z.number().optional(),
});
