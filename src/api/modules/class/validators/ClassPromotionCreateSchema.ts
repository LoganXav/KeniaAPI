import { z } from "zod";
import { PromotionStatus } from "@prisma/client";

export const classPromotionCreateSchema = z.object({
  userId: z.number({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a number",
  }),
  tenantId: z.number({
    required_error: "Tenant ID is required",
    invalid_type_error: "Tenant ID must be a number",
  }),
  toClassId: z.number({
    required_error: "To Class ID is required",
    invalid_type_error: "To Class ID must be a number",
  }),
  toClassDivisionName: z.string({
    required_error: "To Class Division Name is required",
    invalid_type_error: "To Class Division Name must be a string",
  }),
  studentId: z.number({
    required_error: "Student ID is required",
    invalid_type_error: "Student ID must be a number",
  }),
  calendarId: z.number({
    required_error: "Calendar ID is required",
    invalid_type_error: "Calendar ID must be a number",
  }),
  promotionStatus: z.nativeEnum(PromotionStatus, { invalid_type_error: "Invalid promotion status" }),
  comments: z
    .string({
      required_error: "Comments are required",
      invalid_type_error: "Comments must be a string",
    })
    .min(1, "Comments cannot be empty")
    .max(500, "Comments must be less than 500 characters"),
});
