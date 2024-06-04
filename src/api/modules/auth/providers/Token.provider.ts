import { TokenType, UserToken } from "@prisma/client"
import { ITokenProvider } from "./contracts/ITokenProvider"

import DbClient from "~/infrastructure/internal/database"
import {
  CreateUserTokenRecordType,
  FindUserActiveTokenByTypeType,
  UpdateUserTokenActivationRecordType
} from "~/api/shared/types/UserInternalApiTypes"
export default class TokenProvider implements ITokenProvider {
  public async createUserTokenRecord(
    args: CreateUserTokenRecordType,
    tx?: any
  ): Promise<UserToken> {
    const { userId, tokenType, expiresAt, token } = args
    const dbClient = tx ? tx : DbClient
    const userToken = await dbClient.userToken.create({
      data: {
        userId,
        tokenType,
        token,
        expiresAt
      }
    })

    return userToken
  }

  public async findUserTokensByType(
    args: {
      userId: number
      tokenType: TokenType
    },
    tx?: any
  ): Promise<UserToken[]> {
    const { userId, tokenType } = args
    const dbClient = tx ? tx : DbClient
    const userTokens = await dbClient.userToken.findMany({
      where: {
        userId,
        tokenType
      }
    })

    return userTokens
  }

  public async updateUserTokenRecord(
    args: UpdateUserTokenActivationRecordType,
    tx?: any
  ): Promise<UserToken> {
    const { expired, tokenId, isActive } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient.userToken.update({
      where: {
        id: tokenId
      },
      data: { expired, isActive }
    })

    return result
  }

  public async findUserTokenByToken(
    otpToken: string,
    tx?: any
  ): Promise<UserToken> {
    const dbClient = tx ? tx : DbClient
    const userToken = await dbClient.userToken.findFirst({
      where: {
        token: otpToken
      }
    })

    return userToken
  }
  public async findActiveUserTokenByType(
    args: FindUserActiveTokenByTypeType,
    tx?: any
  ): Promise<UserToken> {
    const { userId, tokenType, expired, isActive } = args
    const dbClient = tx ? tx : DbClient
    const userToken = await dbClient.userToken.findFirst({
      where: {
        userId,
        tokenType,
        expired,
        isActive
      }
    })

    return userToken
  }
}
