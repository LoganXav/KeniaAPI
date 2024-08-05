import { z } from "zod";
import { createPermissionSchema } from "../validators/PermissionCreateSchema";

export type CreatePermissionData = z.infer<typeof createPermissionSchema>;

export interface PermissionCriteria {
  id?: number;
  name?: string;
  tenantId?: number;
}

export interface UpdatePermissionData {
  name?: string;
  tenantId?: number;
}

export interface GetAndUpdatePermission {
  criteria: PermissionCriteria;
  data: UpdatePermissionData;
  updateStatus?: boolean;
}
