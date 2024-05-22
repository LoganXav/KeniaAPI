import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { RegisterPrincipalUserAccountDTO } from "../types/authDTO"
import AuthProvider from "../providers/auth/Auth.provider"
import {
  ACCOUNT_CREATED,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"

@autoInjectable()
export default class AuthSignUpService extends BaseService<RegisterPrincipalUserAccountDTO> {
  authProvider: AuthProvider
  constructor(authProvider: AuthProvider) {
    super()
    this.authProvider = authProvider
  }
  public async execute(
    args: RegisterPrincipalUserAccountDTO
  ): Promise<IResult> {
    const data = await this.authProvider.registerPrincipalUserAccount(args)

    this.result.setData(
      SUCCESS,
      HttpStatusCodeEnum.CREATED,
      ACCOUNT_CREATED,
      data
    )
    return this.result
  }
}
