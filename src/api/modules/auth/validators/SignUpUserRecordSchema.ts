import { z } from "zod";

export const signUpUserRecordSchema = z.object({
  firstName: z.string({
    required_error: "Argument first name is missing",
  }),
  lastName: z.string({
    required_error: "Argument last name is missing",
  }),
  password: z.string({
    required_error: "Argument password is missing",
  }),
  phoneNumber: z.string({
    message: "Invalid phone number format",
  }),
  email: z
    .string({
      required_error: "Argument email is missing",
    })
    .email("Not a valid email"),
});
