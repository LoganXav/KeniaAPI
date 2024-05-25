import { UserToken } from "@prisma/client"
import { CreateUserTokenDTO } from "../../types/AuthDTO"

export interface ITokenProvider {
  createUserTokenRecord(
    args: CreateUserTokenDTO,
    dbClient: any
  ): Promise<UserToken>
}
