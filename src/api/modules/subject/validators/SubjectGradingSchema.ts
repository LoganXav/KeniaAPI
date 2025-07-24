import { z } from "zod";

const continuousAssessmentScoreSchema = z.object({
  id: z.number().optional(),
  name: z.string({ required_error: "CA name is required" }),
  score: z
    .number({
      required_error: "CA score is required",
      invalid_type_error: "CA score must be a number",
    })
    .min(0),
});

export const subjectGradingCreateRequestSchema = z.object({
  id: z.number().optional(),

  studentId: z.number({
    required_error: "Student ID is required",
    invalid_type_error: "Student ID must be a number",
  }),

  subjectId: z.number({
    required_error: "Subject ID is required",
    invalid_type_error: "Subject ID must be a number",
  }),

  calendarId: z.number({
    required_error: "Calendar ID is required",
    invalid_type_error: "Calendar ID must be a number",
  }),

  termId: z.number({
    required_error: "Term ID is required",
    invalid_type_error: "Term ID must be a number",
  }),

  examScore: z.number({
    required_error: "Exam score is required",
    invalid_type_error: "Exam score must be a number",
  }),

  continuousAssessmentScores: z.array(continuousAssessmentScoreSchema, {
    required_error: "Continuous Assessment Scores are required",
    invalid_type_error: "Continuous Assessment Scores must be an array",
  }),

  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
  userId: z.number({
    required_error: "Auth User ID is required",
    invalid_type_error: "Auth User ID must be a number",
  }),
});

export const subjectBulkGradingCreateRequestSchema = z.object({
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),

  subjectId: z.number({
    required_error: "Subject ID is required",
    invalid_type_error: "Subject ID must be a number",
  }),

  calendarId: z.number({
    required_error: "Calendar ID is required",
    invalid_type_error: "Calendar ID must be a number",
  }),

  classId: z.number({
    required_error: "Class ID is required",
    invalid_type_error: "Class ID must be a number",
  }),

  termId: z.number({
    required_error: "Term ID is required",
    invalid_type_error: "Term ID must be a number",
  }),

  grades: z.array(
    z.object({
      admissionNo: z.string({
        required_error: "Admission number fields are required",
        invalid_type_error: "Admission number must be a string",
      }),
      examScore: z.number({
        required_error: "Exam score fields are required",
        invalid_type_error: "Exam score must be a number",
      }),
      continuousAssessmentScores: z.array(continuousAssessmentScoreSchema, {
        required_error: "Continuous Assessment Scores are required",
        invalid_type_error: "Continuous Assessment Scores must be an array",
      }),
    })
  ),
});
