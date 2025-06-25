import { z } from "zod";
import DateTimeUtils from "~/utils/DateTimeUtil";
import { breakPeriodCreateSchema } from "../../breakPeriod/validators/BreakPeriodCreateSchema";

export const termCreateSchema = z
  .object({
    id: z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),

    name: z.string({ required_error: "Term name is required", invalid_type_error: "Term name must be a string" }).min(1, "Term name cannot be empty"),

    startDate: z
      .string({ required_error: "Term start date is required", invalid_type_error: "Term start date must be a string" })
      .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid start date format" })
      .transform((val) => DateTimeUtils.parseToISO(val)),

    endDate: z
      .string({ required_error: "Term end date is required", invalid_type_error: "Term end date must be a string" })
      .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid end date format" })
      .transform((val) => DateTimeUtils.parseToISO(val)),

    calendarId: z.number({ required_error: "Calendar ID is required", invalid_type_error: "Calendar ID must be a number" }).optional(),

    tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).optional(),

    breakWeeks: z.array(breakPeriodCreateSchema).optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Term start date cannot be after end date",
    path: ["startDate"],
  });
