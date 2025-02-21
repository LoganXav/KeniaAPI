import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { STAFF_RESOURCE, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StaffReadProvider from "../providers/StaffRead.provider";
import { StaffCriteriaType } from "../types/StaffTypes";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import StaffReadCache from "../cache/StaffRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";

@autoInjectable()
export default class StaffReadService extends BaseService<IRequest> {
  static serviceName = "StaffReadService";
  staffReadProvider: StaffReadProvider;
  userReadCache: UserReadCache;
  loggingProvider: ILoggingDriver;
  staffReadCache: StaffReadCache;

  constructor(staffReadProvider: StaffReadProvider, userReadCache: UserReadCache, staffReadCache: StaffReadCache) {
    super(StaffReadService.serviceName);
    this.staffReadProvider = staffReadProvider;
    this.userReadCache = userReadCache;
    this.staffReadCache = staffReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.params);

      const staffUser = await this.staffReadCache.getOneByCriteria({ ...args.body, ...args.params });

      if (!staffUser) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STAFF_RESOURCE), staffUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async staffRead(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const criteria = { ...args.query, tenantId: args.body.tenantId };

      const staffs = await this.staffReadCache.getByCriteria(criteria);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STAFF_RESOURCE), staffs);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
