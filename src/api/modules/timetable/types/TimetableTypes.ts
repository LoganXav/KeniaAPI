import { BreakType, Period, Subject, Weekday } from "@prisma/client";
import { BreakWeekType, TermType } from "../../schoolCalendar/types/SchoolCalendarTypes";

export type TimetableCreateRequestType = {
  id?: number;
  day: Weekday;
  classDivisionId: number;
  tenantId: number;
  termId: number;
};

export type TimetableReadRequestType = {
  ids?: number[];
  classDivisionId?: number;
  day?: Weekday;
  tenantId: number;
};

export type TimetableReadOneRequestType = {
  id?: number;
  classDivisionId?: number;
  day?: Weekday;
  tenantId?: number;
};

export type TimetableCriteriaType = {
  id?: number;
  ids?: number[];
  classDivisionId?: number;
  day?: Weekday;
  tenantId?: number;
  termId?: number;
};

export type TimetableResponseType = {
  id: number;
  day: Weekday;
  classDivisionId: number;
  tenantId: number;
  periods?: Period[];
};

export type TimetableDeleteRequestType = {
  id: number;
  tenantId: number;
};

export type TimetableCreateOrUpdateRequestType = {
  id?: number;
  day: Weekday;
  classDivisionId: number;
  tenantId: number;
  termId: number;
  periods: Period[];
};

export type TimetableType = {
  id?: number;
  day: string;
  termId: number;
  // term: TermType;
  periods: PeriodType[];
  tenantId: number;
  classDivisionId: number;
};

export type PeriodType = {
  id: number;
  startTime: string;
  endTime: string;
  subjectId: number;
  subject: Subject;
  timetableId: number;
  isBreak: boolean;
  breakType?: "SHORTBREAK" | "LONGBREAK" | null;
  tenantId: number;
};
