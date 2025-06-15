import { z } from "zod";

export const classDivisionCreateSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  classId: z.number({ required_error: "Class is required" }),
  classDivisionTeacherId: z.number({ required_error: "Class Teacher is required" }).optional(),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
  userId: z.number({ required_error: "Auth User ID is required" }),
});
