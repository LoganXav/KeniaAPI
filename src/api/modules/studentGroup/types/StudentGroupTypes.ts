import { Student } from "@prisma/client";

export type StudentGroupCreateRequestType = {
  name: string;
  tenantId: number;
};

export type StudentGroupReadRequestType = {
  ids?: number[];
  name?: string;
  tenantId: number;
};

export type StudentGroupReadOneRequestType = {
  id?: number;
  name?: string;
  tenantId?: number;
};

export type StudentGroupUpdateRequestType = {
  id: number;
  name?: string;
  tenantId?: number;
};

export type StudentGroupCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  tenantId?: number;
};

export type StudentGroupResponseType = {
  id: number;
  name: string;
  tenantId: number;
  students: Student[];
};

export type StudentGroupDeleteRequestType = {
  id: number;
  tenantId: number;
};
