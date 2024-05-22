import { autoInjectable } from "tsyringe"
import DbClient from "~/infrastructure/internal/database"
import { IAuthProvider } from "../contracts/IAuth.provider"
import { RegisterPrincipalUserAccountDTO, User } from "../../types/authDTO"

@autoInjectable()
export default class AuthProvider implements IAuthProvider {
  public async registerPrincipalUserAccount(
    args: RegisterPrincipalUserAccountDTO
  ): Promise<User> {
    const { firstName, lastName, phoneNumber, email } = args
    const result = await DbClient.principal.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email
      }
    })

    return Promise.resolve(result)
  }
}
