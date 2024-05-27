import { Tenant } from "@prisma/client"

export interface ITenantInternalApiProvider {
  createTenantRecord(dbClient: any): Promise<Tenant>
}
