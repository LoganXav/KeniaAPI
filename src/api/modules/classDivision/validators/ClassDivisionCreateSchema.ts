import { z } from "zod";

export const classDivisionCreateSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  classId: z.number({ required_error: "Class ID is required" }),
  classDivisionTeacherId: z.number().optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
