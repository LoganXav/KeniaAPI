import { Period, Weekday } from "@prisma/client";

export type TimetableCreateRequestType = {
  id?: number;
  day: Weekday;
  classDivisionId: number;
  tenantId: number;
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
  periods: Period[];
};
