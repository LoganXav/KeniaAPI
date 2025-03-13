import { BreakPeriod } from "@prisma/client";

export type TermCreateRequestType = {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  calendarId: number;
  tenantId: number;
};

export type TermReadRequestType = {
  ids?: number[];
  calendarId?: number;
  tenantId: number;
};

export type TermReadOneRequestType = {
  id?: number;
  calendarId?: number;
  tenantId?: number;
};

export type TermCriteriaType = {
  id?: number;
  ids?: number[];
  calendarId?: number;
  tenantId?: number;
};

export type TermResponseType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  calendarId: number;
  tenantId: number;
  breakWeeks?: BreakPeriod[];
};

export type TermDeleteRequestType = {
  id: number;
  tenantId: number;
};
