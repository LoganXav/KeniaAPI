import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { GuardianDeleteRequestType } from "../types/GuardianTypes";
import GuardianDeleteProvider from "../providers/GuardianDelete.provider";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class GuardianDeleteService extends BaseService<GuardianDeleteRequestType> {
  static serviceName = "GuardianDeleteService";
  private guardianDeleteProvider: GuardianDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianDeleteProvider: GuardianDeleteProvider) {
    super(GuardianDeleteService.serviceName);
    this.guardianDeleteProvider = guardianDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: GuardianDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const guardian = await this.guardianDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardian);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
