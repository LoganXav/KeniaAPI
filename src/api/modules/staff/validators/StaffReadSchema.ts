import { z } from "zod";

export const staffReadParamsSchema = z.object({
  ids: z.array(z.string()).optional(),
  roleId: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const staffReadOneParamsSchema = z.object({
  id: z.string(),
});
