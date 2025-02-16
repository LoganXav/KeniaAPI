import { z } from "zod";

export const classDeleteSchema = z.object({
  id: z.number(),
});

export type ClassDeleteRequestType = z.infer<typeof classDeleteSchema>;
