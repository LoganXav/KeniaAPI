import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { User } from "@prisma/client";

import { UpdateUserAccountVerificationRecordType, UpdateUserRecordType, UpdateUserLastLoginDateType, UpdateUserPasswordType } from "../../types/UserInternalApiTypes";

export default class UserUpdateProvider {
  public async updateUserAccountVerificationRecord(args: UpdateUserAccountVerificationRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, hasVerified } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: { hasVerified },
    });

    return result;
  }

  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, isFirstTimeLogin } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: {
        ...(isFirstTimeLogin && { isFirstTimeLogin }),
      },
    });

    return result;
  }

  public async updateUserLastLoginDate(args: UpdateUserLastLoginDateType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, lastLoginDate } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: { lastLoginDate },
    });

    return result;
  }

  public async updateUserPassword(args: UpdateUserPasswordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, password } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: { password },
    });

    return result;
  }

  public async updateUserProfile(args: any, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, newTenantId, newRoleId, newStudentId, newStaffId } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: {
        ...(newTenantId && { tenant: { connect: { id: newTenantId } } }),
        ...(newRoleId && { role: { connect: { id: newRoleId } } }),
        ...(newStudentId && { student: { connect: { studentId: newStudentId } } }),
        ...(newStaffId && { staff: { connect: { staffId: newStaffId } } }),
      },
    });

    return result;
  }
}
