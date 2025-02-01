import { z } from "zod";

export const staffTemplateParamsSchema = z.object({
  codeValue: z
    .string({
      required_error: "Code Value is required",
    })
    .optional(),
});
