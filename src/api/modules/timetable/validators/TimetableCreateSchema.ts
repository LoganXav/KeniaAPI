import { z } from "zod";
import { Weekday } from "@prisma/client";
import { periodCreateSchema } from "../../period/validators/PeriodCreateSchema";

export const timetableCreateOrUpdateSchema = z.object({
  id: z.number().optional(),
  day: z.nativeEnum(Weekday),
  classDivisionId: z.number(),
  tenantId: z.number(),
  periods: z.array(periodCreateSchema),
});
