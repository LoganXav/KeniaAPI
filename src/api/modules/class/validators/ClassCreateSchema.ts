import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classCreateSchema = z.object({
  // name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(ClassList),
  classTeacherId: z.number().optional(),
  tenantId: z.number().optional(),
});
