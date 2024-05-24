import { UserTokenTypesEnum } from "@prisma/client"
import { CreateUserTokenDTO } from "../../types/AuthDTO"

export interface ITokenProvider {
  createUserTokenRecord(args: CreateUserTokenDTO): Promise<{
    id: number
    userId: number
    token: string
    tokenType: UserTokenTypesEnum
    expiresOn: Date
    hasExpired: boolean | null
  }>
}
