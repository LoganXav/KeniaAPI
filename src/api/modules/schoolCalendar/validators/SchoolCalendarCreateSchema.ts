import { z } from "zod";
import { termCreateSchema } from "../../term/validators/TermCreateSchema";

export const schoolCalendarCreateSchema = z.object({
  userId: z.number({ required_error: "User ID is required", invalid_type_error: "User ID must be a number" }),
  year: z.number({ required_error: "Year is required", invalid_type_error: "Year must be a number" }).min(2000, { message: "Year must be after 2000" }),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
  terms: z.array(termCreateSchema).optional(),
});
