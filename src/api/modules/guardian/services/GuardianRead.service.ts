import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import GuardianReadProvider from "~/api/modules/guardian/providers/GuardianRead.provider";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class GuardianReadService extends BaseService<IRequest> {
  static serviceName = "GuardianReadService";
  private guardianReadProvider: GuardianReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianReadProvider: GuardianReadProvider) {
    super(GuardianReadService.serviceName);
    this.guardianReadProvider = guardianReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const { firstName, lastName } = args.query;

      const guardians = await this.guardianReadProvider.getByCriteria({ ...args.body, firstName, lastName });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardians);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const guardian = await this.guardianReadProvider.getOneByCriteria({ id: args.params.id, ...args.body });

      if (!guardian) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(GUARDIAN_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

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
