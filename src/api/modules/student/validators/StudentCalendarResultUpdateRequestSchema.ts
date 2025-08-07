import { z } from "zod";

export const StudentCalendarResultUpdateRequestSchema = z.object({
  finalized: z.boolean({ required_error: "Finalized is required" }),
  userId: z.number({ required_error: "User Id is required", invalid_type_error: "User Id must be a number" }),
  classId: z.number({ required_error: "Class Id is required", invalid_type_error: "Class Id must be a number" }),
  tenantId: z.number({ required_error: "Tenant Id is required", invalid_type_error: "Tenant Id must be a number" }),
  calendarId: z.number({ required_error: "Calendar Id is required", invalid_type_error: "Calendar Id must be a number" }),
});
