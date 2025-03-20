import { z } from "zod";
import { Weekday } from "@prisma/client";
import { periodCreateSchema } from "../../period/validators/PeriodCreateSchema";

export const timetableCreateOrUpdateSchema = z.object({
  id: z.number({ invalid_type_error: "ID must be a number" }).optional(),
  day: z.nativeEnum(Weekday, {
    required_error: "Day is required",
    invalid_type_error: "Day must be a valid weekday",
  }),
  classDivisionId: z.number({
    required_error: "Class division ID is required",
    invalid_type_error: "Class division ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
  periods: z.array(periodCreateSchema),
});
