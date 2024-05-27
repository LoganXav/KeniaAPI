import { z } from "zod"

export const createProprietorRecordSchema = z.object({
  firstName: z.string({
    required_error: "Parameter first name is missing"
  }),
  lastName: z.string({
    required_error: "Parameter last name is missing"
  }),
  password: z.string({
    required_error: "Parameter password is missing"
  }),
  phoneNumber: z.string({
    message: "Invalid phone number format"
  }),
  email: z
    .string({
      required_error: "Parameter email is missing"
    })
    .email("Not a valid email")
})
