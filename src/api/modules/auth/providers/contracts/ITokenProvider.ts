import { TokenType, UserToken } from "@prisma/client"
import {
  FindUserActiveTokenByTypeType,
  UpdateUserTokenActivationRecordType
} from "~/api/shared/types/UserInternalApiTypes"

export interface ITokenProvider {
  createUserTokenRecord(args: UserToken, tx?: any): Promise<UserToken>

  findUserTokensByType(
    args: {
      userId: number
      tokenType: TokenType
    },
    tx?: any
  ): Promise<UserToken[]>

  updateUserTokenRecord(
    args: UpdateUserTokenActivationRecordType,
    tx?: any
  ): Promise<UserToken>

  findUserTokenByToken(otpToken: string, tx?: any): Promise<UserToken>

  findActiveUserTokenByType(
    args: FindUserActiveTokenByTypeType,
    tx?: any
  ): Promise<UserToken>
}
