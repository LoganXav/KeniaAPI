import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createRoleSchema } from "../validators/RoleCreateSchema";

export type CreateRoleData = z.infer<typeof createRoleSchema>;

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
