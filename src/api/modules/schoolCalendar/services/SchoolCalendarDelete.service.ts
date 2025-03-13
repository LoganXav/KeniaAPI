import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SchoolCalendarDeleteRequestType } from "../types/SchoolCalendarTypes";
import SchoolCalendarDeleteProvider from "../providers/SchoolCalendarDelete.provider";
import { SUCCESS, SCHOOL_CALENDAR_RESOURCE, ERROR, TERM_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND_WITH_ID } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";

@autoInjectable()
export default class SchoolCalendarDeleteService extends BaseService<SchoolCalendarDeleteRequestType> {
  static serviceName = "SchoolCalendarDeleteService";
  schoolCalendarDeleteProvider: SchoolCalendarDeleteProvider;
  loggingProvider: ILoggingDriver;
  termReadProvider: TermReadProvider;

  constructor(schoolCalendarDeleteProvider: SchoolCalendarDeleteProvider, termReadProvider: TermReadProvider) {
    super(SchoolCalendarDeleteService.serviceName);
    this.schoolCalendarDeleteProvider = schoolCalendarDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.termReadProvider = termReadProvider;
  }

  public async execute(trace: ServiceTrace, args: SchoolCalendarDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const existingTerms = await this.termReadProvider.getOneByCriteria({ calendarId: args.id, tenantId: args.tenantId });

      if (existingTerms) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND_WITH_ID(TERM_RESOURCE));
      }

      const schoolCalendar = await this.schoolCalendarDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(SCHOOL_CALENDAR_RESOURCE), schoolCalendar);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
