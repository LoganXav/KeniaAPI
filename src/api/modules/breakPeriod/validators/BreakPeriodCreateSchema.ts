import { z } from "zod";

export const breakPeriodCreateSchema = z.object({
  id: z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
  name: z.string({ required_error: "Break period name is required", invalid_type_error: "Break period name must be a string" }).optional(),
  startDate: z.string({ required_error: "Break period start date is required", invalid_type_error: "Break period start date must be a string" }).optional(),
  endDate: z.string({ required_error: "Break period end date is required", invalid_type_error: "Break period end date must be a string" }).optional(),
  termId: z.number({ required_error: "Term ID is required", invalid_type_error: "Term ID must be a number" }).optional(),
  tenantId: z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).optional(),
});
