import { z } from "zod";
import { createGroupSchema } from "../validators/GroupCreateSchema";

export type CreateGroupData = z.infer<typeof createGroupSchema>;

export interface GroupCriteria {
  id?: number;
  name?: string;
  tenantId?: number;
}

export interface UpdateGroupData {
    name?: string;
    tenantId?: number;
  }

export interface GetAndUpdateGroup {
    criteria: GroupCriteria;
    data: UpdateGroupData;
    updateStatus?: boolean;
}
