import { z } from "zod";

export const verifyOtpTokenSchema = z.object({
  id: z.number({
    required_error: "Argument id is missing",
  }),
  otpToken: z
    .string({
      required_error: "Argument otpToken is missing",
    })
    .min(5, { message: "Invalid Token" })
    .max(5, { message: "Invalid Token" }),
});
