import { Document } from "@prisma/client";

export type DocumentTypeCreateRequestType = {
  name: string;
  tenantId: number;
};

export type DocumentTypeReadRequestType = {
  ids?: number[];
  name?: string;
  tenantId: number;
};

export type DocumentTypeReadOneRequestType = {
  id?: number;
  name?: string;
  tenantId?: number;
};

export type DocumentTypeUpdateRequestType = {
  id: number;
  name?: string;
  tenantId?: number;
};

export type DocumentTypeCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  tenantId?: number;
};

export type DocumentTypeResponseType = {
  id: number;
  name: string;
  tenantId: number;
  document: Document[];
};

export type DocumentTypeDeleteRequestType = {
  id: number;
  tenantId: number;
};
