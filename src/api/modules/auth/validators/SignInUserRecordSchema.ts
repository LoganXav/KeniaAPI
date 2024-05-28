import { z } from "zod"

export const signInUserRecordSchema = z.object({
  password: z.string({
    required_error: "Parameter password is missing"
  }),
  email: z
    .string({
      required_error: "Parameter email is missing"
    })
    .email("Not a valid email")
})
