import { z } from "zod";

export const SubjectDeleteSchema = z.object({
  id: z.number({
    required_error: "Subject ID is required",
    invalid_type_error: "Subject ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});

export type SubjectDeleteSchemaType = z.infer<typeof SubjectDeleteSchema>;
