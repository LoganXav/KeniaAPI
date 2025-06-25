import { z } from "zod";

export const tenantGradingStructureCreateSchema = z
  .object({
    id: z
      .number({
        required_error: "ID is required",
        invalid_type_error: "ID must be a number",
      })
      .optional(),
    name: z.string().min(1, "Policy name is required"),
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
        z
          .object({
            minimumScore: z.number({ required_error: "Minimum score is required" }).min(0, "Minimum score must be at least 0").max(100, "Minimum score must be 100 or less"),
            maximumScore: z.number({ required_error: "Maximum score is required" }).min(0, "Maximum score must be at least 0").max(100, "Maximum score must be 100 or less"),
            grade: z.string().min(1, "Grade is required"),
            remark: z.string().min(1, "Remark is required"),
          })
          .refine((b) => b.maximumScore >= b.minimumScore, {
            message: "Maximum score must be greater than or equal to minimum score",
          })
      )
      .nonempty("At least one grade boundary must be provided")
      .refine(
        (boundaries) => {
          if (!boundaries || boundaries.length === 0) return false;

          // Sort by minimum score
          const sorted = [...boundaries].sort((a, b) => a.minimumScore - b.minimumScore);

          // 1. Start must be 0
          if (sorted[0].minimumScore !== 0) return false;

          // 2. End must be 100
          if (sorted[sorted.length - 1].maximumScore !== 100) return false;

          // 3. Check for continuity without gaps or overlaps
          for (let i = 0; i < sorted.length - 1; i++) {
            const curr = sorted[i];
            const next = sorted[i + 1];
            if (curr.maximumScore + 1 !== next.minimumScore) {
              return false;
            }
          }

          return true;
        },
        {
          message: "Grade boundaries must cover 0 to 100 without gaps or overlaps (e.g. 0–39, 40–59, 60–100)",
          path: ["gradeBoundaries"],
        }
      ),
  })
  .refine((data) => data.continuousAssessmentWeight + data.examWeight === 100, {
    message: "Continuous Assessment Weight and Exam Weight must add up to 100",
    path: ["continuousAssessmentWeight"],
  });
