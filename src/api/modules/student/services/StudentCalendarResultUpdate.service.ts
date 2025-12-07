import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";
import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StudentTermResultReadProvider from "../providers/StudentTermResultRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentCalendarResultUpdateProvider from "../providers/StudentCalendarResultUpdate.provider";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SUCCESS, STUDENT_CALENDAR_RESULT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NormalizedAppError } from "~/infrastructure/internal/exceptions/NormalizedAppError";

@autoInjectable()
export default class StudentCalendarResultUpdateService extends BaseService<IRequest> {
  static serviceName = "StudentCalendarResultUpdateService";
  loggingProvider: ILoggingDriver;
  termReadProvider: TermReadProvider;
  studentTermResultReadProvider: StudentTermResultReadProvider;
  studentCalendarResultUpdateProvider: StudentCalendarResultUpdateProvider;

  constructor(studentCalendarResultUpdateProvider: StudentCalendarResultUpdateProvider, studentTermResultReadProvider: StudentTermResultReadProvider, termReadProvider: TermReadProvider) {
    super(StudentCalendarResultUpdateService.serviceName);
    this.termReadProvider = termReadProvider;
    this.studentTermResultReadProvider = studentTermResultReadProvider;
    this.studentCalendarResultUpdateProvider = studentCalendarResultUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { studentId, calendarId, tenantId } = args.body;

      // validate that all the term results for that calendar year has been finalized
      await this.validateTermResultsFinalized({ studentId, calendarId, tenantId });

      const updatedStudentCalendarResult = await this.studentCalendarResultUpdateProvider.update({
        ...args.body,
        studentId: Number(args.params.id),
      });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_CALENDAR_RESULT_RESOURCE), updatedStudentCalendarResult);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  private async validateTermResultsFinalized(args: { studentId: number; calendarId: number; tenantId: number }) {
    try {
      const { studentId, calendarId, tenantId } = args;

      const totalTerms = await this.termReadProvider.count({ calendarId, tenantId });
      const finalizedTermResultsCount = await this.studentTermResultReadProvider.count({
        studentId,
        tenantId,
        finalized: true,
      });

      if (totalTerms !== finalizedTermResultsCount) {
        throw new BadRequestError("All term results for the calendar year must be finalized before session results can be finalized.");
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }
}
