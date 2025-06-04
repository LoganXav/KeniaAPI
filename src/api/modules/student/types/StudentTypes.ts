import { z } from "zod";
import { ClassList, Subject, User } from "@prisma/client";
import { studentUpdateSchema, studentUpdateManySchema } from "../validators/StudentUpdateSchema";
import { studentCreateRequestSchema, studentCriteriaSchema } from "../validators/StudentCreateSchema";

export type StudentCreateRequestType = z.infer<typeof studentCreateRequestSchema>;
export type StudentCriteriaType = z.infer<typeof studentCriteriaSchema>;
export type StudentUpdateRequestType = z.infer<typeof studentUpdateSchema>;
export type StudentUpdateManyRequestType = z.infer<typeof studentUpdateManySchema>;

export interface StudentCreateType {
  userId: number;
  tenantId: number;
  classId: number;
  classDivisionId: number;
  enrollmentDate?: string;
  admissionNo?: string;
  studentGroupIds?: number[];
  dormitoryId?: number;
  guardianIds?: number[];
  subjectIds?: number[];
}

export type StudentWithRelationsType = {
  id: number;
  userId: number;
  classId: number | null;
  classDivisionId: number | null;
  class: {
    id: number;
    name: ClassList | null;
    tenantId: number;
  } | null;
  classDivision: {
    id: number;
    name: string;
  } | null;
  dormitory: {
    id: number;
    name: string;
  } | null;
  guardians: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    residentialAddress: string | null;
    residentialStateId: number | null;
    residentialLgaId: number | null;
    residentialCountryId: number | null;
    residentialZipCode: number | null;
    tenantId: number;
  }[];
  studentGroups: {
    id: number;
    name: string;
  }[];
  subjects: Subject[];
  user: User;
};

export interface StudentCriteria {
  id?: number;
  admissionNo?: string;
  classId?: number;
  userId?: number;
  tenantId?: number;
  dormitoryId?: number;
  guardianIds?: number[];
}
