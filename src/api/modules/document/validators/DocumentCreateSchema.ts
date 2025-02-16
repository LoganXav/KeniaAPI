import { z } from "zod";

export const documentCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().min(1, "URL is required"),
  studentId: z.number().optional(),
  documentTypeId: z.number().min(1, "Document Type ID is required"),
  tenantId: z.number().min(1, "Tenant ID is required"),
});
