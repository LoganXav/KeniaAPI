import { z } from "zod";
import { termCreateSchema } from "../../term/validators/TermCreateSchema";

export const schoolCalendarCreateSchema = z.object({
  userId: z.number({ required_error: "User ID is required", invalid_type_error: "User ID must be a number" }).optional(),
  id: z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
  year: z.number({ required_error: "Year is required", invalid_type_error: "Year must be a number" }),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
  terms: z.array(termCreateSchema).optional(),
});
