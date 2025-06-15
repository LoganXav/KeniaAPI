import { z } from "zod";

export const staffReadParamsSchema = z.object({
  ids: z.array(z.string()).optional(),
  jobTitle: z.string().optional(),
});
