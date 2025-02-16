import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  type: z.nativeEnum(ClassList).optional(),
  classTeacherId: z.number().optional(),
  tenantId: z.number().optional(),
});
