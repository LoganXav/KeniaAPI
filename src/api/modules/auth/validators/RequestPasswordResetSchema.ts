import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  email: z
    .string({
      required_error: "Argument email is missing",
    })
    .email("Not a valid email"),
});
