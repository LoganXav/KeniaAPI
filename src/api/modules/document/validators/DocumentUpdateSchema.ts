import { z } from "zod";

export const documentUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  studentId: z.number().optional(),
  url: z.string().min(1).optional(),
  documentTypeId: z.number().optional(),
  tenantId: z.number().optional(),
});
