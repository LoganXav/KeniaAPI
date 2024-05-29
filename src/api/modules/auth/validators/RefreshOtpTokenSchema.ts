import { z } from "zod"

export const refreshOtpTokenSchema = z.object({
  id: z.number({
    required_error: "Argument id is missing"
  }),
  email: z
    .string({
      required_error: "Argument email is missing"
    })
    .email("Not a valid email"),
  hasVerified: z.boolean({
    required_error: "Argument hasVerified is missing"
  })
})
