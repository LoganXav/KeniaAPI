import { z } from "zod";

export const ClassDivisionDeleteSchema = z.object({
  id: z.number({
    required_error: "Class division ID is required",
    invalid_type_error: "Class division ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});

export type ClassDivisionDeleteSchemaType = z.infer<typeof ClassDivisionDeleteSchema>;
