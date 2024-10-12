// import { staffCriteriaSchema } from "./StaffCreateSchema";
import * as z from "zod";

export const staffUpdateSchema = z.object({
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
  groupIds: z.array(z.number()).optional(),
  classIds: z.array(z.number()).optional(),
  subjectIds: z.array(z.number()).optional(),
});

export const staffUpdateManySchema = z.object({
  ids: z.array(
    z.number({
      required_error: "Argument ids is missing",
    })
  ),
  jobTitle: z.string().optional(),
  roleId: z.number().optional(),
  groupIds: z.array(z.number()).optional(),
  classIds: z.array(z.number()).optional(),
  subjectIds: z.array(z.number()).optional(),
});

// export const staffUpdateSchema = z.object({
//   data: staffUpdateDataSchema.refine((data) => Object.keys(data).length > 0, {
//     message: "At least one data field is required",
//   }),
// });
