import { z } from "zod";
import { Weekday } from "@prisma/client";

export const timetableReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  classDivisionId: z.number().optional(),
  day: z.nativeEnum(Weekday).optional(),
  tenantId: z.number().optional(),
});
