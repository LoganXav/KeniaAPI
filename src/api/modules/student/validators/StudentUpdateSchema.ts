import * as z from "zod";

export const studentUpdateSchema = z.object({
  id: z.number({ required_error: "Student ID is required" }),
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  classId: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email("Invalid guardian email").optional(),
  admissionNo: z.string().optional(),

  // User related fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date of birth format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      const date = new Date(val);
      return date;
    }),
  residentialAddress: z.string().optional(),
  residentialStateId: z.number().optional(),
  residentialLgaId: z.number().optional(),
  residentialCountryId: z.number().optional(),
  residentialZipCode: z.number().optional(),
});

export const studentUpdateManySchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  ids: z.array(
    z.number({
      required_error: "Argument ids is missing",
    })
  ),
  classId: z.string().optional(),
});
