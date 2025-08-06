import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { SUCCESS, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import StudentCalendarResultReadProvider from "../providers/StudentCalendarResultRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StudentCalendarResultReadService extends BaseService<IRequest> {
  static serviceName = "StudentCalendarResultReadService";
  loggingProvider: ILoggingDriver;
  studentCalendarResultReadProvider: StudentCalendarResultReadProvider;

  constructor(studentCalendarResultReadProvider: StudentCalendarResultReadProvider) {
    super(StudentCalendarResultReadService.serviceName);
    this.studentCalendarResultReadProvider = studentCalendarResultReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const { tenantId } = args.body;
      const { calendarId, classId, classDivisionId } = args.query;

      const calendarResults = await this.studentCalendarResultReadProvider.getByCriteria({ tenantId: Number(tenantId), calendarId: Number(calendarId), classId: Number(classId), classDivisionId: Number(classDivisionId) });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_RESOURCE), calendarResults);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
