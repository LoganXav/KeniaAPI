import { Permission } from "@prisma/client";

export type CreateRoleData = {
  tenantId: number;
  name: string;
  rank: number;
  permissions: Permission[];
};

export interface RoleCriteria {
  id?: number;
  name?: string;
  tenantId?: number;
}

export interface UpdateRoleData {
  name?: string;
  tenantId?: number;
}

export interface GetAndUpdateRole {
  criteria: RoleCriteria;
  data: UpdateRoleData;
  updateStatus?: boolean;
}
