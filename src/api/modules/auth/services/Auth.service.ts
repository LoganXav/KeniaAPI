import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { Result } from "~/api/shared/helpers/results/Result"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { CreateUserDTO } from "../types/userDTO"
import AuthProvider from "../providers/auth/Auth.provider"

@autoInjectable()
export default class AuthService extends BaseService<CreateUserDTO> {
  authProvider: AuthProvider
  constructor(authProvider: AuthProvider) {
    super()
    this.authProvider = authProvider
  }
  public async execute(args: CreateUserDTO): Promise<IResult> {
    const result = new Result()
    const data = await this.authProvider.createUser(args)
    const message = "Success"

    result.setData(data, message, this.applicationStatus.SUCCESS)
    return result
  }
}
