import { z } from "zod"

export const principalUserRegistrationSchema = z.object({
  email: z
    .string({
      required_error: "Parameter email is missing"
    })
    .email("Not a valid email")
})
