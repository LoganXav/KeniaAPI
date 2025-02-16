import { z } from "zod";

export const DocumentDeleteSchema = z.object({
  id: z.number({
    required_error: "Document ID is required",
    invalid_type_error: "Document ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});

export type DocumentDeleteSchemaType = z.infer<typeof DocumentDeleteSchema>;
