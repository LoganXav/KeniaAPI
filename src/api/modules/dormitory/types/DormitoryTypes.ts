import { Student } from "@prisma/client";

export type DormitoryCreateRequestType = {
  name: string;
  tenantId: number;
};

export type DormitoryReadRequestType = {
  ids?: number[];
  name?: string;
  tenantId: number;
};

export type DormitoryReadOneRequestType = {
  id?: number;
  name?: string;
  tenantId?: number;
};

export type DormitoryUpdateRequestType = {
  id: number;
  name?: string;
  tenantId?: number;
};

export type DormitoryCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  tenantId?: number;
};

export type DormitoryResponseType = {
  id: number;
  name: string;
  tenantId: number;
  students: Student[];
};

export type DormitoryDeleteRequestType = {
  id: number;
  tenantId: number;
};
