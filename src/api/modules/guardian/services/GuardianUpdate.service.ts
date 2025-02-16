import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { GuardianUpdateRequestType } from "../types/GuardianTypes";
import GuardianUpdateProvider from "../providers/GuardianUpdate.provider";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class GuardianUpdateService extends BaseService<GuardianUpdateRequestType> {
  static serviceName = "GuardianUpdateService";
  private guardianUpdateProvider: GuardianUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianUpdateProvider: GuardianUpdateProvider) {
    super(GuardianUpdateService.serviceName);
    this.guardianUpdateProvider = guardianUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: GuardianUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const guardian = await this.guardianUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardian);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
