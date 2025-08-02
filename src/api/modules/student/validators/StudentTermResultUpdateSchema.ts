import { z } from "zod";

export const StudentTermResultUpdateRequestSchema = z.object({
  tenantId: z.number({ required_error: "Tenant Id is required", invalid_type_error: "Tenant Id must be a numner" }),
  userId: z.number({ required_error: "User Id is required", invalid_type_error: "User Id must be a number" }),
  finalized: z.boolean({ required_error: "Finalized is required" }),
});
