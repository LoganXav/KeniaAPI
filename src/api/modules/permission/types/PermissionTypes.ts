import { z } from "zod";

export interface PermissionCreateRequestType {
  name: string;
  tenantId: number;
}

export interface PermissionReadCriteria {
  tenantId: number;
}

export interface UpdatePermissionData {
  name?: string;
  tenantId?: number;
}

export interface GetAndUpdatePermission {
  criteria: PermissionCreateRequestType;
  data: UpdatePermissionData;
  updateStatus?: boolean;
}
