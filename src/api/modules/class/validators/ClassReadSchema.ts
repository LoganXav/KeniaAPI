import { z } from "zod";
import { ClassList } from "@prisma/client";

export const classReadSchema = z.object({
  userId: z.number({ required_error: "Auth User ID is required" }),
  tenantId: z.number({ required_error: "Tenant ID is required" }),
});
