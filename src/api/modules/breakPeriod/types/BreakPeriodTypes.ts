export type BreakPeriodCreateRequestType = {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  termId: number;
  tenantId: number;
};

export type BreakPeriodReadRequestType = {
  ids?: number[];
  termId?: number;
  tenantId: number;
};

export type BreakPeriodReadOneRequestType = {
  id?: number;
  termId?: number;
  tenantId?: number;
};

export type BreakPeriodUpdateRequestType = {
  id: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  termId?: number;
  tenantId?: number;
};

export type BreakPeriodCriteriaType = {
  id?: number;
  ids?: number[];
  termId?: number;
  tenantId?: number;
};

export type BreakPeriodResponseType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  termId: number;
  tenantId: number;
};

export type BreakPeriodDeleteRequestType = {
  id: number;
  tenantId: number;
};
