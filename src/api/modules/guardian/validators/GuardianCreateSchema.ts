import { z } from "zod";

export const guardianCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  tenantId: z.number().min(1, "Tenant ID is required"),
});
