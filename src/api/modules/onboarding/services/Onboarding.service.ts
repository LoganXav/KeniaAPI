import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { TenantOnboardingStatusType } from "@prisma/client";
import { IResult } from "~/api/shared/helpers/results/IResult";
import UserReadCache from "~/api/modules/user/cache/UserRead.cache";
import StaffReadCache from "~/api/modules/staff/cache/StaffRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserUpdateProvider from "~/api/modules/user/providers/UserUpdate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import TenantUpdateProvider from "~/api/modules/tenant/providers/TenantUpdate.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS, TENANT_RESOURCE, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { onboardingPersonalInformationDataType, onboardingResidentialInformationDataType, onboardingSchoolInformationDataType } from "~/api/modules/onboarding/types/OnboardingTypes";
@autoInjectable()
export default class OnboardingService extends BaseService<IRequest> {
  static serviceName = "OnboardingService";
  loggingProvider: ILoggingDriver;
  userReadCache: UserReadCache;
  staffReadCache: StaffReadCache;
  userUpdateProvider: UserUpdateProvider;
  tenantUpdateProvider: TenantUpdateProvider;
  constructor(userUpdateProvider: UserUpdateProvider, userReadCache: UserReadCache, tenantUpdateProvider: TenantUpdateProvider, staffReadCache: StaffReadCache) {
    super(OnboardingService.serviceName);
    this.userReadCache = userReadCache;
    this.staffReadCache = staffReadCache;
    this.userUpdateProvider = userUpdateProvider;
    this.tenantUpdateProvider = tenantUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const { tenantId, userId } = args.body;

      const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, TenantOnboardingStatusType.RESIDENTIAL);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(USER_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async residentialInformation(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const { tenantId, userId } = args.body;

      const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, TenantOnboardingStatusType.SCHOOL);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(USER_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async schoolInformation(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const { tenantId, userId } = args.body;

      const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, TenantOnboardingStatusType.COMPLETE);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(TENANT_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async updateTenantAndUserOnboardingTransaction(tenantId: number, args: onboardingPersonalInformationDataType | onboardingResidentialInformationDataType | onboardingSchoolInformationDataType, onboardingStatus: TenantOnboardingStatusType) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userUpdateProvider.updateOneByCriteria(args, tx);
        await this.userReadCache.invalidate(tenantId);
        await this.staffReadCache.invalidate(tenantId);

        const updateTenantInput = { ...args, onboardingStatus, tenantId };
        const tenant = await this.tenantUpdateProvider.updateOneByCriteria(updateTenantInput, tx);

        const returnData = onboardingStatus == TenantOnboardingStatusType.COMPLETE ? tenant : user;
        return { ...returnData };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
