import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SchoolCalendarReadRequestType, SchoolCalendarReadOneRequestType } from "../types/SchoolCalendarTypes";
import SchoolCalendarReadProvider from "../providers/SchoolCalendarRead.provider";
import { SUCCESS, SCHOOL_CALENDAR_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

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

  public async readOne(trace: ServiceTrace, args: SchoolCalendarReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const schoolCalendar = await this.schoolCalendarReadProvider.getOneByCriteria(args);
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
