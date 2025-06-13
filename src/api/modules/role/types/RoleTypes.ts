import { Permission } from "@prisma/client";

export type RoleCreateData = {
  tenantId: number;
  name: string;
  description?: string;
  isAdmin?: boolean;
  scope?: string;
  permissionIds: number[];
  staffIds: number[];
};

export interface RoleReadCriteria {
  id?: number;
  name?: string;
  description?: string;
  scope?: string;
  permissions?: Permission[];
  tenantId: number;
}

export interface RoleUpdateData {
  id: number;
  description?: string;
  name?: string;
  scope?: string;
  permissionIds?: number[];
  staffIds?: number[];
  tenantId: number;
}

export interface GetAndUpdateRole {
  data: RoleUpdateData;
  updateStatus?: boolean;
  criteria: RoleReadCriteria;
}
