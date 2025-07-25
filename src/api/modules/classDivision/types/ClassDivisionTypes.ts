import { Class } from "@prisma/client";

export type ClassDivisionCreateRequestType = {
  name: string;
  classId: number;
  tenantId: number;
  classDivisionTeacherId?: number;
};

export type ClassDivisionReadRequestType = {
  ids?: number[];
  name?: string;
  classId?: number;
  tenantId: number;
};

export type ClassDivisionReadOneRequestType = {
  id?: number;
  name?: string;
  classId?: number;
  tenantId: number;
};

export type ClassDivisionUpdateRequestType = {
  id: number;
  name?: string;
  classId?: number;
  tenantId: number;
  classDivisionTeacherId?: number;
};

export type ClassDivisionCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  classId?: number;
  tenantId: number;
  classDivisionTeacherId?: number;
};

export type ClassDivisionResponseType = {
  id: number;
  name: string;
  classId: number;
  tenantId: number;
  class: Class;
};

export type ClassDivisionDeleteRequestType = {
  id: number;
  tenantId: number;
};
