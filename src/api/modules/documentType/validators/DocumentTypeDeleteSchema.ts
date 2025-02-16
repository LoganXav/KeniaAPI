import { z } from "zod";

export const DocumentTypeDeleteSchema = z.object({
  id: z.number({
    required_error: "Document type ID is required",
    invalid_type_error: "Document type ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});

export type DocumentTypeDeleteSchemaType = z.infer<typeof DocumentTypeDeleteSchema>;
