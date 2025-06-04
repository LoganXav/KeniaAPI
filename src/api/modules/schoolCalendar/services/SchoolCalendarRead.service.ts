import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import SchoolCalendarReadProvider from "../providers/SchoolCalendarRead.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, SCHOOL_CALENDAR_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { SchoolCalendarReadRequestType, SchoolCalendarReadOneRequestType } from "../types/SchoolCalendarTypes";
import { IRequest } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SchoolCalendarReadService extends BaseService<SchoolCalendarReadRequestType> {
  static serviceName = "SchoolCalendarReadService";
  schoolCalendarReadProvider: SchoolCalendarReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(schoolCalendarReadProvider: SchoolCalendarReadProvider) {
    super(SchoolCalendarReadService.serviceName);
    this.schoolCalendarReadProvider = schoolCalendarReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SchoolCalendarReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const schoolCalendars = await this.schoolCalendarReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SCHOOL_CALENDAR_RESOURCE), schoolCalendars);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;
      const { year } = args.query;
      const schoolCalendar = await this.schoolCalendarReadProvider.getOneByCriteria({ tenantId, year: Number(year) });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SCHOOL_CALENDAR_RESOURCE), schoolCalendar);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
