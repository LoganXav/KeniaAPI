import { z } from "zod";

export const subjectCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classId: z.number().optional(),
  tenantId: z.number().min(1, "Tenant ID is required"),
  staffIds: z.array(z.number().int("Staff ID must be an integer")).optional(),
});
