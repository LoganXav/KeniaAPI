import { z } from "zod";
import { BreakType } from "@prisma/client";

export const periodCreateSchema = z.object({
  id: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  subjectId: z.number().optional(),
  timetableId: z.number().optional(),
  isBreak: z.boolean().default(false),
  breakType: z.nativeEnum(BreakType).optional(),
  tenantId: z.number(),
});
