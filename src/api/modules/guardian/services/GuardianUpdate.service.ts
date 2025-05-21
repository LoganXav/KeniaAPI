import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import GuardianUpdateProvider from "~/api/modules/guardian/providers/GuardianUpdate.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class GuardianUpdateService extends BaseService<IRequest> {
  static serviceName = "GuardianUpdateService";
  private guardianUpdateProvider: GuardianUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianUpdateProvider: GuardianUpdateProvider) {
    super(GuardianUpdateService.serviceName);
    this.guardianUpdateProvider = guardianUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const guardian = await this.guardianUpdateProvider.update({ ...args.body, id: Number(args.params.id) });

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
