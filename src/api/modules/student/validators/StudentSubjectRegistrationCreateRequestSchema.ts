import { z } from "zod";

export const studentSubjectRegistrationCreateRequestSchema = z.object({
  studentId: z.number({
    required_error: "Student ID is required",
    invalid_type_error: "Student ID must be a number",
  }),

  subjectIds: z.array(
    z.number({
      required_error: "Subject ID is required",
      invalid_type_error: "Subject ID must be a number",
    })
  ),

  calendarId: z.number({
    required_error: "Calendar ID is required",
    invalid_type_error: "Calendar ID must be a number",
  }),

  classId: z.number({
    required_error: "Class ID is required",
    invalid_type_error: "Class ID must be a number",
  }),

  classDivisionId: z.number({
    required_error: "Class Division ID is required",
    invalid_type_error: "Class Division ID must be a number",
  }),

  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
});
