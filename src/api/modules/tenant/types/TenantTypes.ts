import { Class, Group, Permission, Role, Staff, Student, Subject, Tenant, TenantMetadata, UserToken } from "@prisma/client";

// TODO: Add createTeneant record params
export type CreateTenantRecordType = null;

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
