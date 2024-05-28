import { Tenant } from "@prisma/client"

export interface ITenantInternalApiProvider {
  createTenantRecord(tx?: any): Promise<Tenant>
}
