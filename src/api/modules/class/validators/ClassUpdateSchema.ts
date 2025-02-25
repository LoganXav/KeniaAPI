import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.nativeEnum(ClassList).optional(),
  classTeacherId: z.number().optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
