import { z } from "zod";
import { Staff, StaffEmploymentType, Subject } from "@prisma/client";
import { staffUpdateManySchema, staffUpdateSchema } from "~/api/modules/staff/validators/StaffUpdateSchema";
import { staffCriteriaSchema, staffCreateRequestSchema } from "~/api/modules/staff/validators/StaffCreateSchema";

export type StaffCreateRequestType = z.infer<typeof staffCreateRequestSchema>;
export type StaffCriteriaVType = z.infer<typeof staffCriteriaSchema>;
export type StaffUpdateRequestType = z.infer<typeof staffUpdateSchema>;
export type StaffUpdateManyRequestType = z.infer<typeof staffUpdateManySchema>;

export interface StaffCriteriaType {
  tenantId: number;
  id?: number;
  ids?: number[];
  userId?: number;
  roleId?: number;
  jobTitle?: string;
}

export interface StaffUpdateDataType {
  userId?: number;
  jobTitle?: string;
  roleId?: number;
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
    dateOfBirth?: string;
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
  tenantId: number;
}

export interface StaffWithRelationsType extends Staff {
  subjects: Subject[];
}
