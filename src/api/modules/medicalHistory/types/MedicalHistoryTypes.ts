import { Student } from "@prisma/client";

export type MedicalHistoryCreateRequestType = {
  name: string;
  description?: string;
  studentId: number;
  tenantId: number;
};

export type MedicalHistoryReadRequestType = {
  ids?: number[];
  name?: string;
  studentId?: number;
  tenantId: number;
};

export type MedicalHistoryReadOneRequestType = {
  id?: number;
  name?: string;
  studentId?: number;
  tenantId?: number;
};

export type MedicalHistoryUpdateRequestType = {
  id: number;
  name?: string;
  description?: string;
  studentId?: number;
  tenantId?: number;
};

export type MedicalHistoryCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  studentId?: number;
  tenantId?: number;
};

export type MedicalHistoryResponseType = {
  id: number;
  name: string;
  description: string | null;
  studentId: number;
  tenantId: number;
  student: Student;
};

export type MedicalHistoryDeleteRequestType = {
  id: number;
  tenantId: number;
};
