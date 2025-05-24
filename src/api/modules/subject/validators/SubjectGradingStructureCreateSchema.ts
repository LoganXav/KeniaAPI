import { z } from "zod";

export const subjectGradingStructureCreateSchema = z.object({
  id: z
    .number({
      required_error: "ID is required",
      invalid_type_error: "ID must be a number",
    })
    .optional(),
  subjectId: z.number({
    required_error: "Subject ID is required",
    invalid_type_error: "Subject ID must be a number",
  }),
  staffId: z.number({
    required_error: "Staff ID is required",
    invalid_type_error: "Staff ID must be a number",
  }),
  tenantGradingStructureId: z.number({
    required_error: "Tenant Grading Structure ID is required",
    invalid_type_error: "Tenant Grading Structure ID must be a number",
  }),
  continuousAssessmentBreakdownItems: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string({ required_error: "CA Item name is required" }),
      weight: z
        .number({
          required_error: "CA Item weight is required",
          invalid_type_error: "CA Item weight must be a number",
        })
        .min(0)
        .max(100),
    }),
    {
      required_error: "CA Breakdown Items are required",
      invalid_type_error: "CA Breakdown Items must be an array",
    }
  ),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
  userId: z.number({
    required_error: "Auth User ID is required",
    invalid_type_error: "Auth User ID must be a number",
  }),
});
