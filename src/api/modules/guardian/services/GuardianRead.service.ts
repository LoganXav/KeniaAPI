import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { GuardianReadRequestType, GuardianReadOneRequestType } from "../types/GuardianTypes";
import GuardianReadProvider from "../providers/GuardianRead.provider";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class GuardianReadService extends BaseService<GuardianReadRequestType> {
  static serviceName = "GuardianReadService";
  private guardianReadProvider: GuardianReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianReadProvider: GuardianReadProvider) {
    super(GuardianReadService.serviceName);
    this.guardianReadProvider = guardianReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: GuardianReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const guardians = await this.guardianReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardians);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: GuardianReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const guardian = await this.guardianReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardian);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
