import { UserToken } from "@prisma/client"
import { ITokenProvider } from "./contracts/ITokenProvider"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export default class TokenProvider implements ITokenProvider {
  public async createUserTokenRecord(args: UserToken, dbClient: any) {
    const { userId, tokenType, expiresAt, token } = args

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
}
