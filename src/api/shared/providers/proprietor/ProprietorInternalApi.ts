import DbClient from "~/infrastructure/internal/database"
import { Role, User } from "@prisma/client"
import { IProprietorInternalApiProvider } from "../contracts/IProprietorInternalApiProvider"
import { autoInjectable } from "tsyringe"
import { ProprietorRecordDTO } from "../../types/ProprietorInternalApiTypes"
import {
  UpdateUserFirstTimeLoginRecordDTO,
  UpdateUserAccountVerificationRecordDTO,
  updateUserLastLoginDateDTO
} from "~/api/modules/auth/types/AuthDTO"
import DateTimeUtil from "~/utils/DateTimeUtil"

@autoInjectable()
export default class ProprietorInternalApiProvider
  implements IProprietorInternalApiProvider
{
  public async findProprietorByEmail(email: string, tx?: any) {
    const dbClient = tx ? tx : DbClient
    const result = await DbClient?.user?.findFirst({
      where: {
        email: email,
        role: Role.PROPRIETOR
      }
    })

    return result
  }

  public async findProprietorById(id: number, tx?: any) {
    const dbClient = tx ? tx : DbClient
    const result = await DbClient?.user?.findFirst({
      where: {
        id,
        role: Role.PROPRIETOR
      }
    })

    return result
  }

  public async createProprietorRecord(
    args: ProprietorRecordDTO,
    tx?: any
  ): Promise<User> {
    const { tenantId, firstName, lastName, password, phoneNumber, email } = args
    const dbClient = tx ? tx : DbClient
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

    return result
  }

  public async updateUserAccountVerificationRecord(
    args: UpdateUserAccountVerificationRecordDTO,
    tx?: any
  ): Promise<User> {
    const { userId, hasVerified } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.update({
      where: {
        id: userId
      },
      data: { hasVerified }
    })

    return result
  }

  public async updateUserFirstTimeLoginRecord(
    args: UpdateUserFirstTimeLoginRecordDTO,
    tx?: any
  ): Promise<User> {
    const { userId, isFirstTimeLogin } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.update({
      where: {
        id: userId
      },
      data: { isFirstTimeLogin }
    })

    return result
  }

  public async updateUserLastLoginDate(
    args: updateUserLastLoginDateDTO,
    tx?: any
  ): Promise<User> {
    const { userId, lastLoginDate } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.update({
      where: {
        id: userId
      },
      data: { lastLoginDate }
    })

    return result
  }
}
