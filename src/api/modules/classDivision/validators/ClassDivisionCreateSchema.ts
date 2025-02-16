import { z } from "zod";

export const classDivisionCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classId: z.number().min(1, "Class ID is required"),
  tenantId: z.number().optional(),
});
