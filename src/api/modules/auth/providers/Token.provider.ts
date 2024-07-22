import { TokenType, UserToken } from "@prisma/client";
import { ITokenProvider } from "./contracts/ITokenProvider";

import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { CreateUserTokenRecordType, FindUserActiveTokenByTypeType, UpdateUserTokenActivationRecordType } from "~/api/shared/types/UserInternalApiTypes";
export default class TokenProvider implements ITokenProvider {
  public async createUserTokenRecord(args: CreateUserTokenRecordType, dbClient: PrismaTransactionClient = DbClient) {
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

  public async findUserTokensByType(
    args: {
      userId: number;
      tokenType: TokenType;
    },
    dbClient: PrismaTransactionClient = DbClient
  ) {
    const { userId, tokenType } = args;
    const userTokens = await dbClient.userToken.findMany({
      where: {
        userId,
        tokenType,
      },
    });

    return userTokens;
  }

  public async updateUserTokenRecord(args: UpdateUserTokenActivationRecordType, dbClient: PrismaTransactionClient = DbClient) {
    const { expired, tokenId, isActive } = args;
    const result = await dbClient.userToken.update({
      where: {
        id: tokenId,
      },
      data: { expired, isActive },
    });

    return result;
  }

  public async findUserTokenByToken(otpToken: string, dbClient: PrismaTransactionClient = DbClient) {
    const userToken = await dbClient.userToken.findFirst({
      where: {
        token: otpToken,
      },
    });

    return userToken;
  }
  public async findActiveUserTokenByType(args: FindUserActiveTokenByTypeType, dbClient: PrismaTransactionClient = DbClient) {
    const { userId, tokenType, expired, isActive } = args;
    const userToken = await dbClient.userToken.findFirst({
      where: {
        userId,
        tokenType,
        expired,
        isActive,
      },
    });

    return userToken;
  }
}
