import { z } from "zod";

export const studentReadSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
  ids: z.array(z.number()).optional(),
  classId: z.number().int("Class ID must be an integer").optional(),
  dormitoryId: z.number().int("Dormitory ID must be an integer").optional(),
});

export const studentReadOneParamsSchema = z.object({
  tenantId: z.number().int("Tenant ID must be an integer"),
});
