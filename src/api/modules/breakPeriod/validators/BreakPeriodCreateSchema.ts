import { z } from "zod";
import DateTimeUtils from "~/utils/DateTimeUtil";

export const breakPeriodCreateSchema = z
  .object({
    id: z.number().optional(),

    name: z.string({ required_error: "Break period name is required" }).min(1, "Break period name cannot be empty"),

    startDate: z
      .string({ required_error: "Start date is required" })
      .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid start date format" })
      .transform((val) => DateTimeUtils.parseToISO(val)),

    endDate: z
      .string({ required_error: "End date is required" })
      .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid end date format" })
      .transform((val) => DateTimeUtils.parseToISO(val)),

    termId: z.number().optional(),
    tenantId: z.number().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Break period start date cannot be after end date",
    path: ["startDate"],
  });
