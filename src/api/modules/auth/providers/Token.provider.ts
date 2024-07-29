import { ITokenProvider } from "./contracts/ITokenProvider";
import { CreateUserTokenRecordType } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { ReadOneTokenRecordType, ReadTokenRecordType, UpdateTokenRecordType } from "~/api/modules/auth/types/AuthTypes";
export default class TokenProvider implements ITokenProvider {
  public async create(args: CreateUserTokenRecordType, dbClient: PrismaTransactionClient = DbClient) {
    const { userId, tokenType, expiresAt, token } = args;
    const userToken = await dbClient.userToken.create({
      data: {
        userId,
        tokenType,
        token,
        expiresAt,
      },
    });

    return userToken;
  }

  public async getOneByCriteria(criteria: ReadOneTokenRecordType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { token } = criteria;
      const result = await dbClient?.userToken?.findFirst({
        where: {
          ...(token && { token }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async getByCriteria(criteria: ReadTokenRecordType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { userId, tokenType } = criteria;
      const result = await dbClient?.userToken?.findMany({
        where: {
          ...(userId && { id: userId }),
          ...(tokenType && { tokenType }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateOneByCriteria(args: UpdateTokenRecordType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { tokenId, isActive, expired } = args;
      const result = await dbClient?.userToken?.update({
        where: {
          id: tokenId,
        },
        data: {
          ...(isActive && { isActive }),
          ...(expired && { expired }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
