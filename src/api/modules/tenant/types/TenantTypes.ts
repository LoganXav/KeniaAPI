import { z } from "zod";
import { createTenantSchema } from "../validators/TenantCreateSchema";

export type CreateTenantData = z.infer<typeof createTenantSchema>;

export interface TenantCriteria {
  id?: number;
  name?: string;
  address?: string;
}

export interface UpdateTenantData {
  name?: string;
  address?: string;
}

export interface GetAndUpdateTenant {
    criteria: TenantCriteria;
    data: UpdateTenantData;
    updateStatus?: boolean;
}
