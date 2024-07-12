import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tenantId: z.number().int("Tenant ID must be an integer"),
});

