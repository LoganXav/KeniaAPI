import { Staff, Class } from "@prisma/client";

export type SubjectCreateRequestType = {
  name: string;
  description?: string;
  classDivisionIds?: number[];
  classId?: number;
  tenantId: number;
  staffIds?: number[];
};

export type SubjectReadRequestType = {
  ids?: number[];
  name?: string;
  classId?: number;
  tenantId: number;
  staffIds?: number[];
};

export type SubjectReadOneRequestType = {
  id?: number;
  name?: string;
  classId?: number;
  tenantId?: number;
  staffIds?: number[];
};

export type SubjectUpdateRequestType = {
  id: number;
  name?: string;
  description?: string;
  classDivisionIds?: number[];
  classId?: number;
  tenantId?: number;
  staffIds?: number[];
};

export type SubjectCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  classId?: number;
  tenantId?: number;
  staffIds?: number[];
};

export type SubjectResponseType = {
  id: number;
  subjectId: string;
  name: string;
  classId?: number;
  tenantId: number;
  class?: Class;
  staffs?: Staff[];
};

export type SubjectDeleteRequestType = {
  id: number;
  tenantId: number;
};
