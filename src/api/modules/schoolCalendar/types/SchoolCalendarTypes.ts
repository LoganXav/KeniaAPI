import { SchoolCalendar, Term } from "@prisma/client";

export type SchoolCalendarReadRequestType = {
  ids?: number[];
  tenantId: number;
};

export type SchoolCalendarReadOneRequestType = {
  id?: number;
  year: number;
  tenantId: number;
};

export type SchoolCalendarCriteriaType = {
  id?: number;
  ids?: number[];
  year: number;
  tenantId: number;
};

export type SchoolCalendarResponseType = {
  id: number;
  year: number;
  tenantId: number;
  terms?: Term[];
};

export type SchoolCalendarDeleteRequestType = {
  id: number;
  tenantId: number;
};

export type SchoolCalendarCreateRequestType = {
  year: number;
  tenantId: number;
  terms: TermType[];
};

export type BreakWeekType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  tenantId: number;
};

export type TermType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  breakWeeks: BreakWeekType[];
  tenantId: number;
  calendar: SchoolCalendar;
};
