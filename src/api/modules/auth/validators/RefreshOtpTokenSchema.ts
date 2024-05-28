import { z } from "zod"

export const refreshOtpTokenSchema = z.object({
  id: z.number({
    required_error: "Parameter userId is missing"
  }),
  email: z
    .string({
      required_error: "Parameter email is missing"
    })
    .email("Not a valid email")
})
