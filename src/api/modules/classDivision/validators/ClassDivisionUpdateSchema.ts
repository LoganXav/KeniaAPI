import { z } from "zod";

export const classDivisionUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  subjectIds: z.array(z.number()).optional(),
  classId: z.number().optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
