import { z } from "zod";

export const subjectUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  classId: z.number().optional(),
  tenantId: z.number().optional(),
  classDivisionIds: z.array(z.number().int("Class Division ID must be an integer")).optional(),
  staffIds: z.array(z.number().int("Staff ID must be an integer")).optional(),
});
