import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classCreateSchema = z.object({
  type: z.nativeEnum(ClassList),
  tenantId: z.number().optional(),
});
