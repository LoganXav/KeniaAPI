import { TokenType } from "@prisma/client"
import { ITokenProvider } from "./contracts/ITokenProvider"
import { autoInjectable } from "tsyringe"
import {
  CreateUserTokenRecordDTO,
  UpdateUserTokenRecordDTO
} from "../types/AuthDTO"
import DbClient from "~/infrastructure/internal/database"
@autoInjectable()
export default class TokenProvider implements ITokenProvider {
  public async createUserTokenRecord(args: CreateUserTokenRecordDTO, tx?: any) {
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

    return Promise.resolve(userToken)
  }

  public async findUserTokensByType(
    args: {
      userId: number
      tokenType: TokenType
    },
    tx?: any
  ) {
    const { userId, tokenType } = args
    const dbClient = tx ? tx : DbClient
    const userTokens = await dbClient.userToken.findMany({
      where: {
        userId,
        tokenType
      }
    })

    return Promise.resolve(userTokens)
  }

  public async updateUserTokenRecord(args: UpdateUserTokenRecordDTO, tx?: any) {
    const { expired, tokenId, isActive } = args
    const dbClient = tx ? tx : DbClient
    const result = await dbClient.userToken.update({
      where: {
        id: tokenId
      },
      data: { expired, isActive }
    })

    return Promise.resolve(result)
  }
}
