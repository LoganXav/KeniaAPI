import { z } from "zod";

export const documentTypeCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tenantId: z.number().optional(),
});
