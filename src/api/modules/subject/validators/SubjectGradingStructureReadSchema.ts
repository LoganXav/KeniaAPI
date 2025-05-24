import { z } from "zod";

export const subjectGradingStructureReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  subjectId: z.number().optional(),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
  userId: z.number({
    required_error: "Auth User ID is required",
    invalid_type_error: "Auth User ID must be a number",
  }),
  staffId: z.number().optional(),
  tenantGradingStructureId: z.number().optional(),
});
