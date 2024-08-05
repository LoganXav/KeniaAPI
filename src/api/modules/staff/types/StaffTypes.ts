import { z } from "zod";
import { createStaffSchema } from "../validators/StaffCreateSchema";

export type CreateStaffData = z.infer<typeof createStaffSchema>;

export interface StaffCriteria {
  id?: number;
  userId?: number;
  roleId?: number;
  jobTitle?: string;
  groupId?: number;
  classId?: number;
  subjectId?: number;
}

export interface UpdateStaffData {
  userId?: number;
  jobTitle?: string;
  roleId?: number;
  groupIds?: number[];
  classIds?: number[];
  subjectIds?: number[];
}

export interface GetAndUpdateStaff {
  criteria: StaffCriteria;
  data: UpdateStaffData;
}
