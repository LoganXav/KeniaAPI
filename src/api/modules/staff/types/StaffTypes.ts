import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createStaffSchema, createStaffUserSchema, getAndUpdateStaffSchema, staffCriteriaSchema, updateStaffDataSchema } from "../validators/StaffCreateSchema";

export type CreateStaffData = z.infer<typeof createStaffSchema>;
export type CreateStaffUserData = z.infer<typeof createStaffUserSchema>;
export type StaffCriteriaV = z.infer<typeof staffCriteriaSchema>;
export type UpdateStaffV = z.infer<typeof updateStaffDataSchema>;
export type GetAndUpdateStaffV = z.infer<typeof getAndUpdateStaffSchema>;

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

export interface CreateStaffUserResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    hasverified: boolean;
    isFirstTimeLogin: boolean;
    lastLoginDate: string;
    usertype: string;
    tenantId: string;
  };
  staff: {
    id: number;
    jobTitle: string;
    userId: number;
    roleId: number;
  };
}

export interface UpdateStaffResponse {
  id: number;
  jobTitle: string;
  userId: number;
  roleId: number;
}
