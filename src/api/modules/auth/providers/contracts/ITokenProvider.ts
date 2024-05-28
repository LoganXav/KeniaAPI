import { UserToken } from "@prisma/client"

export interface ITokenProvider {
  createUserTokenRecord(args: UserToken, dbClient: any): Promise<UserToken>
}
