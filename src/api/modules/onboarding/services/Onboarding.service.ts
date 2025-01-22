import { autoInjectable } from "tsyringe";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserUpdateProvider from "~/api/modules/user/providers/UserUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, NULL_OBJECT, SOMETHING_WENT_WRONG, SUCCESS, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import TenantUpdateProvider from "../../tenant/providers/TenantUpdate.provider";
import { onboardingPersonalInformationDataType } from "../types/OnboardingTypes";
import { TenantOnboardingStatusType } from "@prisma/client";
@autoInjectable()
export default class OnboardingService extends BaseService<unknown> {
  static serviceName = "OnboardingService";
  loggingProvider: ILoggingDriver;
  userUpdateProvider: UserUpdateProvider;
  tenantUpdateProvider: TenantUpdateProvider;
  constructor(userUpdateProvider: UserUpdateProvider, tenantUpdateProvider: TenantUpdateProvider) {
    super(OnboardingService.serviceName);
    this.userUpdateProvider = userUpdateProvider;
    this.tenantUpdateProvider = tenantUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: onboardingPersonalInformationDataType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const data = await this.updateTenantAndUserOnboardingTransaction(args, TenantOnboardingStatusType.RESIDENTIAL);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(USER_RESOURCE), data);
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

  private async updateTenantAndUserOnboardingTransaction(args: onboardingPersonalInformationDataType, onboardingStatus: TenantOnboardingStatusType) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userUpdateProvider.updateOneByCriteria(args, tx);

        // TODO: Recieve TenantId from params
        const updateTenantInput = { onboardingStatus, tenantId: 7 };
        const tenant = await this.tenantUpdateProvider.updateOneByCriteria(updateTenantInput, tx);

        return { user };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
