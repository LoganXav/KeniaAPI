import { Permission } from "@prisma/client";

export type RoleCreateData = {
  tenantId: number;
  name: string;
  permissionIds: number[];
};

export interface RoleReadCriteria {
  id: number;
  name?: string;
  permissions?: Permission[];
  tenantId: number;
}

export interface RoleUpdateData {
  id: number;
  name?: string;
  permissions?: Permission[];
  tenantId: number;
}

export interface GetAndUpdateRole {
  data: RoleUpdateData;
  updateStatus?: boolean;
  criteria: RoleReadCriteria;
}
