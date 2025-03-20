import { z } from "zod";
import { Weekday } from "@prisma/client";

export const timetableReadSchema = z.object({
  // id: z.union([z.number({ invalid_type_error: "ID must be a number" }), z.string({ invalid_type_error: "ID must be a string" })]).optional(),
  // ids: z.array(z.union([z.number({ invalid_type_error: "IDs must be an array of numbers" }), z.string({ invalid_type_error: "IDs must be an array of strings" })])).optional(),
  classDivisionId: z.union([z.number({ invalid_type_error: "Class division ID must be a number" }), z.string({ invalid_type_error: "Class division ID must be a string" })]).optional(),
  day: z.nativeEnum(Weekday, { invalid_type_error: "Day must be a valid weekday" }).optional(),
  // tenantId: z.union([z.number({ invalid_type_error: "Tenant ID must be a number" }), z.string({ invalid_type_error: "Tenant ID must be a string" })]),
});
