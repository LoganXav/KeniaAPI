import { z } from "zod";

export const UserReadSchema = z.object({
  userId: z.string({
    required_error: "User Id is required",
  }),
});
