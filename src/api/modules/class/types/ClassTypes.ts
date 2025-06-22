import { z } from "zod";
import { classCreateSchema } from "../validators/ClassCreateSchema";
import { Staff, Subject, ClassList, Student, ClassDivision } from "@prisma/client";
import { classPromotionCreateSchema } from "../validators/ClassPromotionCreateSchema";

export type CreateClassData = z.infer<typeof classCreateSchema>;

export type ClassPromotionCreateRequestType = z.infer<typeof classPromotionCreateSchema> & { fromClassId: number; fromClassDivisionId: number; toClassDivisionId: number };

export interface ClassCriteria {
  id?: number;
  name?: ClassList;
  tenantId?: number;
}

export interface UpdateClassData {
  name?: ClassList;
  tenantId?: number;
}

export interface GetAndUpdateClass {
  criteria: ClassCriteria;
  data: UpdateClassData;
  updateStatus?: boolean;
}

export type ClassCreateRequestType = {
  name?: ClassList;
  tenantId: number;
};

export type ClassReadRequestType = {
  ids?: number[];
  name?: ClassList;
  type?: ClassList;
  tenantId: number;
};

export type ClassReadOneRequestType = {
  id?: number;
  name?: ClassList;
  type?: ClassList;
  tenantId?: number;
};

export type ClassUpdateRequestType = {
  id: number;
  name?: ClassList;
  tenantId?: number;
};

export type ClassCriteriaType = {
  id?: number;
  ids?: number[];
  name?: ClassList;
  tenantId?: number;
  withoutGradingStructures?: boolean;
};

export type ClassResponseType = {
  id: number;
  name: ClassList;
  tenantId: number;
  students?: Student[];
  subjects?: Subject[];
  divisions?: ClassDivision[];
};

export type ClassDeleteRequestType = {
  id: number;
  tenantId: number;
};

export type ClassPromotionCriteriaType = {
  id?: number;
  studentId?: number;
  calendarId: number;
  classId: number;
  classDivisionId: number;
  tenantId: number;
};

export type ClassPromotionReadOneCriteriaType = {
  studentId: number;
  calendarId: number;
  tenantId: number;
};
