import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import PeriodReadProvider from "../providers/PeriodRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR, PERIOD_RESOURCE, STAFF_RESOURCE, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class PeriodReadService extends BaseService<IRequest> {
  static serviceName = "PeriodReadService";
  loggingProvider: ILoggingDriver;
  private staffReadCache: StaffReadCache;
  periodReadProvider: PeriodReadProvider;

  constructor(periodReadProvider: PeriodReadProvider, staffReadCache: StaffReadCache) {
    super(PeriodReadService.serviceName);
    this.staffReadCache = staffReadCache;
    this.periodReadProvider = periodReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }
  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace);

      const { tenantId, userId } = args.body;

      const staff = await this.staffReadCache.getOneByCriteria({ tenantId, id: userId });

      if (!staff) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE));
      }

      const subjectIds = (staff.subjects ?? []).map((subject) => subject.id);

      const periods = await this.periodReadProvider.getByCriteria({ tenantId, subjectIds });

      const data = periods.map((period) => ({ subject: period?.subject?.name, class: period?.subject?.class?.name, startTime: period.startTime, endTime: period.endTime }));

      const sortedData = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(PERIOD_RESOURCE), sortedData);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
