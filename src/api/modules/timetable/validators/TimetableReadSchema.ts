import { z } from "zod";
import { Weekday } from "@prisma/client";

export const timetableReadRequestSchema = z.object({
  classDivisionId: z.union([z.number({ invalid_type_error: "Class division ID must be a number" }), z.string({ invalid_type_error: "Class division ID must be a string" })]),
  termId: z.union([z.number({ invalid_type_error: "Term ID must be a number" }), z.string({ invalid_type_error: "Term ID must be a string" })]),
});

export const timetableReadOneRequestSchema = z.object({
  classDivisionId: z.union([z.number({ invalid_type_error: "Class division ID must be a number", required_error: "Class division ID is required" }), z.string({ invalid_type_error: "Class division ID must be a string", required_error: "Class division ID is required" })]),
  day: z.nativeEnum(Weekday, { invalid_type_error: "Day must be a valid weekday", required_error: "Day is required" }),
  termId: z.union([z.number({ invalid_type_error: "Term ID must be a number", required_error: "Term ID is required" }), z.string({ invalid_type_error: "Term ID must be a string", required_error: "Term ID is required" })]),
});
