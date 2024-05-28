import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import TokenProvider from "../providers/Token.provider"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { CreateProprietorRecordDTO } from "../types/AuthDTO"

@autoInjectable()
export default class AuthRefreshTokenService extends BaseService<CreateProprietorRecordDTO> {
  static serviceName = "AuthRefreshTokenService"
  tokenProvider: TokenProvider

  constructor(tokenProvider: TokenProvider) {
    super(AuthRefreshTokenService.serviceName)
    this.tokenProvider = tokenProvider
  }

  public async execute(
    trace: ServiceTrace,
    args: CreateProprietorRecordDTO
  ): Promise<IResult> {}
}
