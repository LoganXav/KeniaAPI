import { z } from "zod"

export const verifyOtpTokenSchema = z.object({
  id: z.number({
    required_error: "Parameter id is missing"
  }),
  otpToken: z
    .string({
      required_error: "Parameter otpToken is missing"
    })
    .min(5, { message: "Invalid Token" })
    .max(5, { message: "Invalid Token" })
})
