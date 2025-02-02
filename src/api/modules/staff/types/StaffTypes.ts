import { z } from "zod";
import { staffCriteriaSchema, staffCreateRequestSchema } from "../validators/StaffCreateSchema";
import { staffUpdateManySchema, staffUpdateSchema } from "../validators/StaffUpdateSchema";
import { Permission, StaffEmploymentType } from "@prisma/client";

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
    hasVerified: boolean;
    isFirstTimeLogin: boolean;
    lastLoginDate: string;
    userType: string;
    tenantId: number;
  };
  staff: {
    id: number;
    jobTitle: string;
    address?: string;
    stateId?: number;
    lgaId?: number;
    countryId?: number;
    zipCode?: number;
    postalCode?: string;
    employmentType: string;
    startDate?: string;
    nin?: string;
    tin?: string;
    highestLevelEdu?: string;
    cvUrl?: string;
    userId: number;
    roleId: number;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
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
  employmentType?: StaffEmploymentType;
  startDate?: string;
  nin?: string;
  tin?: string;
  highestLevelEdu?: string;
  cvUrl?: string;
  userId: number;
  roleId: number;
  tenantId: number;
}
