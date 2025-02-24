import { z } from "zod";
import { classCreateSchema } from "../validators/ClassCreateSchema";
import { Staff, Subject, ClassList, Student, ClassDivision } from "@prisma/client";

export type CreateClassData = z.infer<typeof classCreateSchema>;

export interface ClassCriteria {
  id?: number;
  name?: string;
  tenantId?: number;
}

export interface UpdateClassData {
  name?: string;
  tenantId?: number;
}

export interface GetAndUpdateClass {
  criteria: ClassCriteria;
  data: UpdateClassData;
  updateStatus?: boolean;
}

export type ClassCreateRequestType = {
  type?: ClassList;
  tenantId: number;
};

export type ClassReadRequestType = {
  ids?: number[];
  name?: string;
  type?: ClassList;
  classTeacherId?: number;
  tenantId: number;
};

export type ClassReadOneRequestType = {
  id?: number;
  name?: string;
  type?: ClassList;
  classTeacherId?: number;
  tenantId?: number;
};

export type ClassUpdateRequestType = {
  id: number;
  name?: string;
  type?: ClassList;
  classTeacherId?: number;
  tenantId?: number;
};

export type ClassCriteriaType = {
  id?: number;
  ids?: number[];
  type?: ClassList;
  classTeacherId?: number;
  tenantId?: number;
};

export type ClassResponseType = {
  id: number;
  name: string;
  type: ClassList | null;
  classTeacherId: number | null;
  tenantId: number;
  classTeacher?: Staff;
  students?: Student[];
  subjects?: Subject[];
  divisions?: ClassDivision[];
};

export type ClassDeleteRequestType = {
  id: number;
  tenantId: number;
};
