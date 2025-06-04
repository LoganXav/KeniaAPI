import { z } from "zod";

export const classDivisionUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  classId: z.number().optional(),
  classDivisionTeacherId: z.number().optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
