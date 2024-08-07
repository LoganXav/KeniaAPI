import { User } from "@prisma/client";
import { UpdateUserRecordType } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";

export default class UserUpdateProvider {
  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, isFirstTimeLogin, hasVerified } = args;
    const result = await dbClient?.user?.update({
      where: {
        id: userId,
      },
      data: {
        ...(isFirstTimeLogin && { isFirstTimeLogin }),
        ...(hasVerified && { hasVerified }),
      },
    });

    return result;
  }
}
