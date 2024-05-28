import { TokenType, UserToken } from "@prisma/client"
import { UpdateUserTokenRecordDTO } from "../../types/AuthDTO"

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
    args: UpdateUserTokenRecordDTO,
    tx?: any
  ): Promise<UserToken>

  findUserTokenByToken(otpToken: string, tx?: any): Promise<UserToken>
}
