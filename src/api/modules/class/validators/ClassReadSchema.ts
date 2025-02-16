import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  type: z.nativeEnum(ClassList).optional(),
  classTeacherId: z.number().optional(),
  tenantId: z.number().optional(),
});
