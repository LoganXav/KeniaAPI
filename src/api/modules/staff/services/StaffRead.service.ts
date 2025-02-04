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
import UserReadProvider from "../../user/providers/UserRead.provider";
import StaffReadCache from "../cache/StaffRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import ArrayUtil from "~/utils/ArrayUtil";

@autoInjectable()
export default class StaffReadService extends BaseService<any> {
  static serviceName = "StaffReadService";
  staffReadProvider: StaffReadProvider;
  userReadProvider: UserReadProvider;
  loggingProvider: ILoggingDriver;
  staffReadCache: StaffReadCache;

  constructor(staffReadProvider: StaffReadProvider, userReadProvider: UserReadProvider, staffReadCache: StaffReadCache) {
    super(StaffReadService.serviceName);
    this.staffReadProvider = staffReadProvider;
    this.userReadProvider = userReadProvider;
    this.staffReadCache = staffReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StaffCriteriaType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const staff = await this.staffReadProvider.getOneByCriteria(args);

      if (!staff) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }
      const user = await this.userReadProvider.getOneByCriteria({ id: staff.userId });

      const fetchedStaffData = { ...staff, ...user };

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STAFF_RESOURCE), fetchedStaffData);

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

      const { tenantId } = args.body;

      const staffs = ArrayUtil.any(Object.keys(args.query)) ? await this.staffReadCache.getByCriteria({ tenantId, criteria: args.query }) : await this.staffReadCache.getAll(tenantId);

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
