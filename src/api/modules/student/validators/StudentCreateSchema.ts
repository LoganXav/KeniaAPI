import { z } from 'zod';

const today = new Date();

export const createStudentSchema = z.object({
  dob: z.string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= today;
    }, {
      message: "Invalid date format | date is in the future"
    }),
  address: z.string().min(1, "Address is required"),
  enrollmentDate: z.string().date("Enter a valid Date"),
  classId: z.number().int("Invalid classId"),
  tenantId: z.number().int("Invalid tenantId")
});

