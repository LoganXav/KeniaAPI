import { autoInjectable } from "tsyringe";
import DbClient from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, NULL_OBJECT, PASSWORD_RESET_LINK_GENERATED, SOMETHING_WENT_WRONG, SUCCESS, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class OnboardingService extends BaseService<unknown> {
  static serviceName = "OnboardingService";
  loggingProvider: ILoggingDriver;
  userReadProvider: UserReadProvider;
  constructor(userReadProvider: UserReadProvider) {
    super(OnboardingService.serviceName);
    this.userReadProvider = userReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: { email: string }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      // TODO: Update User of role school ownwer record

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, "SIGN_IN_SUCCESSFUL", {});
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
  public async residentialInformation(trace: ServiceTrace, args: { email: string }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      // TODO: Update User of role school ownwer record

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, "SIGN_IN_SUCCESSFUL", {});
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
  public async schoolInformation(trace: ServiceTrace, args: { email: string }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      // TODO: Update Tenant record

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, "SIGN_IN_SUCCESSFUL", {});
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
