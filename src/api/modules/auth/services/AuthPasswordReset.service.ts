import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { IResult } from "~/api/shared/helpers/results/IResult"
import {
  ERROR,
  PASSWORD_RESET_SUCCESSFULLY,
  SOMETHING_WENT_WRONG,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"

export default class AuthPasswordResetService extends BaseService<unknown> {
  static serviceName = "AuthPasswordResetService"
  loggingProvider: ILoggingDriver
  constructor() {
    super(AuthPasswordResetService.serviceName)
    this.loggingProvider = LoggingProviderFactory.build()
  }
  public async execute(trace: ServiceTrace, args: any): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)
      trace.setSuccessful()
      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.SUCCESS,
        PASSWORD_RESET_SUCCESSFULLY
      )
      return this.result
    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        SOMETHING_WENT_WRONG
      )

      return this.result
    }
  }
}
