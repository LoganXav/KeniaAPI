import { z } from "zod";
import { BreakType } from "@prisma/client";

export const periodCreateSchema = z
  .object({
    id: z.number({ invalid_type_error: "ID must be a number" }).optional(),
    startTime: z.string({
      required_error: "Start time is required",
      invalid_type_error: "Start time must be a string",
    }),
    endTime: z.string({
      required_error: "End time is required",
      invalid_type_error: "End time must be a string",
    }),
    subjectId: z.number({ invalid_type_error: "Subject ID must be a number" }).optional(),
    timetableId: z.number({ invalid_type_error: "Timetable ID must be a number" }).optional(),
    isBreak: z.boolean({ invalid_type_error: "Is break must be a boolean" }).default(false),
    breakType: z
      .nativeEnum(BreakType, {
        invalid_type_error: "Break type must be a valid break type",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Ensure breakType is provided if isBreak is true
      return !data.isBreak || (data.isBreak && data.breakType !== undefined);
    },
    {
      message: "Break type is required when isBreak is true",
      path: ["breakType"], // This specifies where the error should appear
    }
  );
