import DbClient from "~/infrastructure/internal/database"
import { Role, User } from "@prisma/client"
import { IProprietorInternalApiProvider } from "../contracts/IProprietorInternalApiProvider"
import { autoInjectable } from "tsyringe"
import { ProprietorRecordDTO } from "../../types/ProprietorInternalApiTypes"
import { CreateProprietorRecordDTO } from "~/api/modules/auth/types/AuthDTO"

@autoInjectable()
export default class ProprietorInternalApiProvider
  implements IProprietorInternalApiProvider
{
  public async findProprietorByEmail(args: CreateProprietorRecordDTO) {
    const result = await DbClient?.user?.findFirst({
      where: {
        email: args.email,
        role: Role.PROPRIETOR
      }
    })

    return Promise.resolve(result)
  }

  public async createProprietorRecord(
    args: ProprietorRecordDTO,
    dbClient: any
  ): Promise<User> {
    const { tenantId, firstName, lastName, password, phoneNumber, email } = args
    const result = await dbClient?.user?.create({
      data: {
        tenantId,
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        role: Role.PROPRIETOR
      }
    })

    return Promise.resolve(result)
  }
}
