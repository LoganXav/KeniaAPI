import DbClient from "~/infrastructure/internal/database"
import { CreateUserTokenDTO } from "../../types/AuthDTO"
import { ITokenProvider } from "../contracts/ITokenProvider"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export default class TokenProvider implements ITokenProvider {
  public async createUserTokenRecord(args: CreateUserTokenDTO) {
    const { userId, tokenType, expiresOn, token } = args

    const userToken = await DbClient.userToken.create({
      data: {
        userId,
        tokenType,
        token,
        expiresOn
      }
    })

    return Promise.resolve(userToken)
  }
}
