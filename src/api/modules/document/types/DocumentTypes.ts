import { DocumentType } from "@prisma/client";

export type DocumentCreateRequestType = {
  name: string;
  url: string;
  studentId?: number;
  documentTypeId: number;
  tenantId: number;
};

export type DocumentReadRequestType = {
  ids?: number[];
  name?: string;
  studentId?: number;
  documentTypeId?: number;
  tenantId: number;
};

export type DocumentReadOneRequestType = {
  id?: number;
  name?: string;
  studentId?: number;
  documentTypeId?: number;
  tenantId?: number;
};

export type DocumentUpdateRequestType = {
  id: number;
  name?: string;
  url?: string;
  studentId?: number;
  documentTypeId?: number;
  tenantId?: number;
};

export type DocumentCriteriaType = {
  id?: number;
  ids?: number[];
  name?: string;
  studentId?: number;
  documentTypeId?: number;
  tenantId?: number;
};

export type DocumentResponseType = {
  id: number;
  name: string;
  url: string;
  studentId: number;
  documentTypeId: number;
  tenantId: number;
  documentType: DocumentType;
};

export type DocumentDeleteRequestType = {
  id: number;
  tenantId: number;
};
