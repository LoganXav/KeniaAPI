import { z } from "zod"

export const confirmPasswordResetSchema = z.object({
  password: z.string({
    required_error: "Argument password is missing"
  })
})
