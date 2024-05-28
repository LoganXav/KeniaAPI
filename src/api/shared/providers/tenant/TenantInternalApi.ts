import { ITenantInternalApiProvider } from "../contracts/ITenantInternalApiProvider"
import { autoInjectable } from "tsyringe"
import { Tenant } from "@prisma/client"

@autoInjectable()
export default class TenantInternalApiProvider
  implements ITenantInternalApiProvider
{
  public async createTenantRecord(dbClient: any) {
    const result: Tenant = await dbClient?.tenant?.create({
      data: {}
    })

    return Promise.resolve(result)
  }
}
