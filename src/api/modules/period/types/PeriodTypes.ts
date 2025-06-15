import { Subject } from "@prisma/client";

export type PeriodCreateRequestType = {
  id?: number;
  startTime: string;
  endTime: string;
  subjectId?: number;
  timetableId: number;
  isBreak: boolean;
  breakType?: "Shortbreak" | "Longbreak";
  tenantId: number;
};

export type PeriodReadRequestType = {
  ids?: number[];
  timetableId?: number;
  subjectId?: number;
  tenantId: number;
};

export type PeriodReadOneRequestType = {
  id?: number;
  timetableId?: number;
  subjectId?: number;
  tenantId?: number;
};

export type PeriodUpdateRequestType = {
  id: number;
  startTime?: string;
  endTime?: string;
  subjectId?: number;
  timetableId?: number;
  isBreak?: boolean;
  breakType?: "Shortbreak" | "Longbreak";
  tenantId?: number;
};

export type PeriodCriteriaType = {
  id?: number;
  ids?: number[];
  timetableId?: number;
  subjectId?: number;
  subjectIds?: number[];
  tenantId?: number;
};

export type PeriodResponseType = {
  id: number;
  startTime: string;
  endTime: string;
  subjectId: number | null;
  timetableId: number;
  isBreak: boolean;
  breakType: "Shortbreak" | "Longbreak" | null;
  tenantId: number;
  subject?: Subject;
};

export type PeriodDeleteRequestType = {
  id: number;
  tenantId: number;
};
