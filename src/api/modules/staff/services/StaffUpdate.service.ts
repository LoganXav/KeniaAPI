import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SOMETHING_WENT_WRONG, STAFF_RESOURCE, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StaffUpdateProvider from "../providers/StaffUpdate.provider";
import { StaffUpdateManyRequestType, StaffUpdateRequestType } from "../types/StaffTypes";
import StaffReadProvider from "../providers/StaffRead.provider";
import { RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import UserReadCache from "../../user/cache/UserRead.cache";
import StaffReadCache from "../cache/StaffRead.cache";
import UserUpdateProvider from "../../user/providers/UserUpdate.provider";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
@autoInjectable()
export default class StaffUpdateService extends BaseService<any> {
  static serviceName = "StaffUpdateService";
  staffUpdateProvider: StaffUpdateProvider;
  staffReadProvider: StaffReadProvider;
  userUpdateProvider: UserUpdateProvider;
  loggingProvider: ILoggingDriver;
  userReadCache: UserReadCache;
  staffReadCache: StaffReadCache;

  constructor(staffUpdateProvider: StaffUpdateProvider, staffReadProvider: StaffReadProvider, userUpdateProvider: UserUpdateProvider, userReadCache: UserReadCache, staffReadCache: StaffReadCache) {
    super(StaffUpdateService.serviceName);
    this.staffReadProvider = staffReadProvider;
    this.staffUpdateProvider = staffUpdateProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.userReadCache = userReadCache;
    this.staffReadCache = staffReadCache;
  }

  public async execute(trace: ServiceTrace, args: StaffUpdateRequestType & { id: string; tenantId: number }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStaff = await this.userReadCache.getOneByCriteria({ tenantId: Number(args.tenantId), id: Number(args.id) });

      if (!foundStaff) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      const result = await this.updateStaffTransaction({ ...args, userId: foundStaff.id });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STAFF_RESOURCE), result);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async updateMany(trace: ServiceTrace, args: StaffUpdateManyRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStaffs = await this.staffReadProvider.getByCriteria({ ids: args.ids, tenantId: args.tenantId });

      if (!foundStaffs.length) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      const staffs = await this.staffUpdateProvider.updateMany(args);
      await this.staffReadCache.invalidate(args.tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staffs);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async updateStaffTransaction(args: StaffUpdateRequestType & { id: string; tenantId: number; userId: number }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userUpdateProvider.updateOneByCriteria({ ...args, userId: Number(args.userId) }, tx);
        const staff = await this.staffUpdateProvider.updateOne(args, tx);

        await this.userReadCache.invalidate(args.tenantId);
        await this.staffReadCache.invalidate(args.tenantId);

        return { ...staff };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
