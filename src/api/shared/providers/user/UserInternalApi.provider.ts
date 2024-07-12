import DbClient from "~/infrastructure/internal/database"
import { Role, User } from "@prisma/client"

import { IUserInternalApiProvider } from "../contracts/IUserInternalApi"
import {
  CreateUserRecordType,
  UpdateUserAccountVerificationRecordType,
  UpdateUserFirstTimeLoginRecordType,
  UpdateUserLastLoginDateType,
  UpdateUserPasswordType
} from "../../types/UserInternalApiTypes"

export default class UserInternalApiProvider
  implements IUserInternalApiProvider
{
  public async findUserByEmail(email: string, tx?: any) {
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.findFirst({
      where: {
        email: email
      }
    })

    return result
  }

  public async findUserById(id: number, tx?: any): Promise<User> {
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.findFirst({
      where: {
        id
      }
    })

    return result
  }

  public async createUserRecord(
    args: CreateUserRecordType,
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
        phoneNumber
      }
    })

    return result
  }

  public async updateUserAccountVerificationRecord(
    args: UpdateUserAccountVerificationRecordType,
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
    args: UpdateUserFirstTimeLoginRecordType,
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
    args: UpdateUserLastLoginDateType,
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

  public async updateUserPassword(
    args: UpdateUserPasswordType,
    tx?: any
  ): Promise<User> {
    const { userId, password } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.update({
      where: {
        id: userId
      },
      data: { password }
    })

    return result
  }

  public async updateUserProfile(
    args: any,
    tx?: any
  ): Promise<User> {
    const { userId, newTenantId, newRoleId, newStudentId, newStaffId} = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient?.user?.update({
      where: {
        id: userId
      },
      data: {
        ...(newTenantId && { tenant: { connect: { id: newTenantId } } }),
        ...(newRoleId && { role: { connect: { id: newRoleId } } }),
        ...(newStudentId && { student: { connect: { studentId: newStudentId } } }),
        ...(newStaffId && { staff: { connect: { staffId: newStaffId } } }),
      },
    })

    return result
  }
}
