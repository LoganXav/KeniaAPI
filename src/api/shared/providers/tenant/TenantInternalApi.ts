import { ITenantInternalApiProvider } from "../contracts/ITenantInternalApiProvider"
import { autoInjectable } from "tsyringe"
import { Tenant } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"

@autoInjectable()
export default class TenantInternalApiProvider
  implements ITenantInternalApiProvider
{
  public async createTenantRecord(tx?: any) {
    const dbClient = tx ? tx : DbClient
    const result: Tenant = await dbClient?.tenant?.create({
      data: {}
    })

    return Promise.resolve(result)
  }
}
