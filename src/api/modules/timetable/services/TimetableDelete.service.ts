import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { TimetableDeleteRequestType } from "../types/TimetableTypes";
import TimetableDeleteProvider from "../providers/TimetableDelete.provider";
import { SUCCESS, TIMETABLE_RESOURCE, ERROR, PERIOD_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND_WITH_ID } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import PeriodReadProvider from "../../period/providers/PeriodRead.provider";
@autoInjectable()
export default class TimetableDeleteService extends BaseService<TimetableDeleteRequestType> {
  static serviceName = "TimetableDeleteService";
  timetableDeleteProvider: TimetableDeleteProvider;
  loggingProvider: ILoggingDriver;
  periodReadProvider: PeriodReadProvider;

  constructor(timetableDeleteProvider: TimetableDeleteProvider, periodReadProvider: PeriodReadProvider) {
    super(TimetableDeleteService.serviceName);
    this.timetableDeleteProvider = timetableDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.periodReadProvider = periodReadProvider;
  }

  public async execute(trace: ServiceTrace, args: TimetableDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const existingPeriods = await this.periodReadProvider.getOneByCriteria({ timetableId: args.id, tenantId: args.tenantId });

      if (existingPeriods) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND_WITH_ID(PERIOD_RESOURCE));
      }

      const timetable = await this.timetableDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
