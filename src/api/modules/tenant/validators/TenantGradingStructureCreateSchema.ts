import { z } from "zod";

export const tenantGradingStructureCreateSchema = z
  .object({
    id: z
      .number({
        required_error: "ID is required",
        invalid_type_error: "ID must be a number",
      })
      .optional(),
    name: z.string({ required_error: "Name is required" }),
    continuousAssessmentWeight: z
      .number({
        required_error: "Continuous Assessment Weight is required",
        invalid_type_error: "Continuous Assessment Weight must be a number",
      })
      .min(0)
      .max(100),
    examWeight: z
      .number({
        required_error: "Exam Weight is required",
        invalid_type_error: "Exam Weight must be a number",
      })
      .min(0)
      .max(100),
    classIds: z.array(z.number(), {
      required_error: "Class IDs are required",
      invalid_type_error: "Class IDs must be an array of numbers",
    }),
    tenantId: z.number({
      required_error: "Tenant ID is required",
      invalid_type_error: "Tenant ID must be a number",
    }),
    userId: z.number({
      required_error: "Auth User ID is required",
      invalid_type_error: "Auth User ID must be a number",
    }),
    gradeBoundaries: z
      .array(
        z.object({
          minimumScore: z.number({ required_error: "Minimum score is required" }).min(0).max(100),
          maximumScore: z.number({ required_error: "Maximum score is required" }).min(0).max(100),
          grade: z.string({ required_error: "Grade is required" }),
          remark: z.string({ required_error: "Remark is required" }),
        }),
        {
          required_error: "Grade boundaries are required",
          invalid_type_error: "Grade boundaries must be an array of objects",
        }
      )
      .nonempty("At least one grade boundary must be provided"),
  })
  .refine((data) => data.continuousAssessmentWeight + data.examWeight === 100, {
    message: "Continuous Assessment Weight and Exam Weight must add up to 100",
    path: ["continuousAssessmentWeight", "examWeight"],
  });
