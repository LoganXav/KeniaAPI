export type CreateRoleData = {
  name: string;
  rank: number;
  permissions: string[];
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
