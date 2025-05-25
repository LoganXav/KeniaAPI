import { z } from "zod";
import { tenantGradingStructureCreateSchema } from "~/api/modules/tenant/validators/TenantGradingStructureCreateSchema";

export type TenantGradingStructureCreateRequestType = z.infer<typeof tenantGradingStructureCreateSchema>;

export interface TenantGradingStructureCriteria {
  tenantId: number;
  classId?: number;
  classIds?: number[];
  id?: number;
}
