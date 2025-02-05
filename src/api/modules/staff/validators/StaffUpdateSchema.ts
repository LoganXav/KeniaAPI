import * as z from "zod";

export const staffUpdateSchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  id: z.number({ required_error: "Id required" }),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
});

export const staffUpdateManySchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required" }),
  ids: z.array(
    z.number({
      required_error: "Argument ids is missing",
    })
  ),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
});
