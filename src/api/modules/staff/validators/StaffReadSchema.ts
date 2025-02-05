import { z } from "zod";

export const staffReadParamsSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  roleId: z.string().optional(),
  jobTitle: z.string().optional(),
});
