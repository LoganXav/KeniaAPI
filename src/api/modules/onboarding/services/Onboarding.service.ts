import { autoInjectable } from "tsyringe";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserUpdateProvider from "~/api/modules/user/providers/UserUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { AUTHORIZATION_REQUIRED, ERROR, NULL_OBJECT, SCHOOL_OWNER_ROLE_RANK, SOMETHING_WENT_WRONG, SUCCESS, TENANT_RESOURCE, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import TenantUpdateProvider from "../../tenant/providers/TenantUpdate.provider";
import { onboardingPersonalInformationDataType, onboardingResidentialInformationDataType, onboardingSchoolInformationDataType } from "../types/OnboardingTypes";
import { TenantOnboardingStatusType } from "@prisma/client";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
@autoInjectable()
export default class OnboardingService extends BaseService<IRequest> {
  static serviceName = "OnboardingService";
  loggingProvider: ILoggingDriver;
  userUpdateProvider: UserUpdateProvider;
  userReadCache: UserReadCache;
  staffReadCache: StaffReadCache;
  tenantUpdateProvider: TenantUpdateProvider;
  constructor(userUpdateProvider: UserUpdateProvider, userReadCache: UserReadCache, tenantUpdateProvider: TenantUpdateProvider, staffReadCache: StaffReadCache) {
    super(OnboardingService.serviceName);
    this.userUpdateProvider = userUpdateProvider;
    this.userReadCache = userReadCache;
    this.staffReadCache = staffReadCache;
    this.tenantUpdateProvider = tenantUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const { tenantId, userId } = args.body;

      const criteria = { tenantId: Number(tenantId), userId: Number(userId) };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      // Refactor to use role and permission properly
      if (foundUser?.staff?.role?.rank !== SCHOOL_OWNER_ROLE_RANK) {
        throw new BadRequestError(AUTHORIZATION_REQUIRED);
      }

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

      const criteria = { tenantId: Number(tenantId), userId: Number(userId) };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      if (foundUser?.staff?.role?.rank !== SCHOOL_OWNER_ROLE_RANK) {
        throw new BadRequestError(AUTHORIZATION_REQUIRED);
      }

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

      const criteria = { tenantId: Number(tenantId), userId: Number(userId) };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      if (foundUser?.staff?.role?.rank !== SCHOOL_OWNER_ROLE_RANK) {
        throw new BadRequestError(AUTHORIZATION_REQUIRED);
      }

      const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, TenantOnboardingStatusType.COMPLETE);

      // update profile completion status
      await this.tenantUpdateProvider.updateMetadata({
        tenantId: Number(tenantId),
        profileStatus: true,
      });

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
