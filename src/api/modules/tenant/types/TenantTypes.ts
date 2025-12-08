import { Role, Staff, Student, Tenant, TenantMetadata } from "@prisma/client";
import { tenantUpdateSchema } from "../validators/TenantUpdateSchema";
import { z } from "zod";

export type TenantUpdateSchemaType = z.infer<typeof tenantUpdateSchema>;

// TODO: Add createTeneant record params
export type CreateTenantRecordType = {
  name: string;
};

export interface TenantReadCriteria {
  id?: number;
  name?: string;
  address?: string;
}

export interface UpdateTenantData {
  name?: string;
  address?: string;
}

export interface GetAndUpdateTenant {
  criteria: TenantReadCriteria;
  data: UpdateTenantData;
  updateStatus?: boolean;
}

export type TenantRecordWithRelations = Tenant & {
  staffs: (Staff & {
    role: Role | null;
  })[];
  students: Student[];
  metadata?: TenantMetadata | null;
};
