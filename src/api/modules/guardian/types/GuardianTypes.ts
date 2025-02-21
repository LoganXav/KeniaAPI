import { Student } from "@prisma/client";
import { z } from "zod";
import { guardianCreateSchema } from "../validators/GuardianCreateSchema";

export type GuardianCreateRequestType = z.infer<typeof guardianCreateSchema>;

export type GuardianReadRequestType = {
  ids?: number[];
  name?: string;
  phone?: string;
  email?: string;
  tenantId: number;
};

export type GuardianReadOneRequestType = {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  tenantId?: number;
};

export type GuardianUpdateRequestType = {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  tenantId?: number;
  studentIds?: number[];
};

export type GuardianCriteriaType = {
  id?: number;
  ids?: number[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  tenantId?: number;
  studentIds?: number[];
};

export type GuardianResponseType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  tenantId: number;
  students: Student[];
};

export type GuardianDeleteRequestType = {
  id: number;
  tenantId: number;
};
