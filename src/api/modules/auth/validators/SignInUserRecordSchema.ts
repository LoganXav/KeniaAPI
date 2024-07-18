import { z } from "zod";

export const signInUserRecordSchema = z.object({
  password: z.string({
    required_error: "Argument password is missing",
  }),
  email: z
    .string({
      required_error: "Argument email is missing",
    })
    .email("Not a valid email"),
  userType: z.string({
    required_error: "Argument userType is missing",
  }),
});
