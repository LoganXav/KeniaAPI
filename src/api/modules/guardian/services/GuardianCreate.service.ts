import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { GuardianCreateRequestType } from "../types/GuardianTypes";
import GuardianCreateProvider from "../providers/GuardianCreate.provider";
import { SUCCESS, GUARDIAN_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import GuardianReadProvider from "../providers/GuardianRead.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { IRequest } from "~/infrastructure/internal/types";
@autoInjectable()
export default class GuardianCreateService extends BaseService<IRequest> {
  static serviceName = "GuardianCreateService";
  private guardianCreateProvider: GuardianCreateProvider;
  private guardianReadProvider: GuardianReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(guardianCreateProvider: GuardianCreateProvider, guardianReadProvider: GuardianReadProvider) {
    super(GuardianCreateService.serviceName);
    this.guardianCreateProvider = guardianCreateProvider;
    this.guardianReadProvider = guardianReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const foundGuardian = await this.guardianReadProvider.getOneByCriteria({
        tenantId: args.body.tenantId,
        email: args.body.email,
      });

      if (foundGuardian) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(GUARDIAN_RESOURCE));
      }
      const guardian = await this.guardianCreateProvider.create(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(GUARDIAN_RESOURCE), guardian);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
