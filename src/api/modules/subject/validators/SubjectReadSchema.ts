import { z } from "zod";

export const subjectReadSchema = z.object({
  id: z.number().optional(),
  ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  classId: z.number().optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
  staffIds: z.array(z.number().int("Staff ID must be an integer")).optional(),
});
