import { z } from "zod";
import { staffCreateSchema, staffCriteriaSchema, staffCreateRequestSchema } from "../validators/StaffCreateSchema";
import { staffUpdateManySchema, staffUpdateSchema } from "../validators/StaffUpdateSchema";

export type StaffCreateDataType = z.infer<typeof staffCreateSchema>;
export type StaffCreateRequestType = z.infer<typeof staffCreateRequestSchema>;
export type StaffCriteriaVType = z.infer<typeof staffCriteriaSchema>;
// export type StaffUpdateVType = z.infer<typeof staffUpdateDataSchema>;
export type StaffUpdateRequestType = z.infer<typeof staffUpdateSchema>;
export type StaffUpdateManyRequestType = z.infer<typeof staffUpdateManySchema>;

export interface StaffCriteriaType {
  id?: number;
  ids?: number[];
  userId?: number;
  roleId?: number;
  jobTitle?: string;
  groupId?: number;
  classId?: number;
  subjectId?: number;
}

export interface StaffUpdateDataType {
  userId?: number;
  jobTitle?: string;
  roleId?: number;
  groupIds?: number[];
  classIds?: number[];
  subjectIds?: number[];
}

export interface StaffGetAndUpdateType {
  criteria: StaffCriteriaType;
  data: StaffUpdateDataType;
}

export interface StaffCreateResponseType {
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

export interface StaffUpdateResponseType {
  id: number;
  jobTitle: string;
  userId: number;
  roleId: number;
}

export interface StaffCreateType {
  jobTitle: string;
  userId: number;
  roleId: number;
  tenantId: number;
}
