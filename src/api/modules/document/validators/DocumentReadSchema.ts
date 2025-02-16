import { z } from "zod";

export const documentReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  studentId: z.number().optional(),
  documentTypeId: z.number().optional(),
  tenantId: z.number().optional(),
});
