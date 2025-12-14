import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StudentTermResultReadProvider from "../providers/StudentTermResultRead.provider";
import StudentTermResultUpdateProvider from "../providers/StudentTermResultUpdate.provider";
import { NormalizedAppError } from "~/infrastructure/internal/exceptions/NormalizedAppError";
import StudentCalendarResultReadProvider from "../providers/StudentCalendarResultRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentCalendarResultUpdateProvider from "../providers/StudentCalendarResultUpdate.provider";
import StudentCalendarResultCreateProvider from "../providers/StudentCalendarResultCreate.provider";
import StudentCalendarResultDeleteProvider from "../providers/StudentCalendarResultDelete.provider";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SUCCESS, STUDENT_TERM_RESULT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class StudentTermResultUpdateService extends BaseService<IRequest> {
  static serviceName = "StudentTermResultUpdateService";
  loggingProvider: ILoggingDriver;
  studentTermResultUpdateProvider: StudentTermResultUpdateProvider;
  studentTermResultReadProvider: StudentTermResultReadProvider;
  studentCalendarResultUpdateProvider: StudentCalendarResultUpdateProvider;
  studentCalendarResultReadProvider: StudentCalendarResultReadProvider;
  studentCalendarResultCreateProvider: StudentCalendarResultCreateProvider;
  studentCalendarResultDeleteProvider: StudentCalendarResultDeleteProvider;

  constructor(
    studentTermResultUpdateProvider: StudentTermResultUpdateProvider,
    studentCalendarResultUpdateProvider: StudentCalendarResultUpdateProvider,
    studentCalendarResultReadProvider: StudentCalendarResultReadProvider,
    studentCalendarResultCreateProvider: StudentCalendarResultCreateProvider,
    studentTermResultReadProvider: StudentTermResultReadProvider,
    studentCalendarResultDeleteProvider: StudentCalendarResultDeleteProvider
  ) {
    super(StudentTermResultUpdateService.serviceName);
    this.studentTermResultReadProvider = studentTermResultReadProvider;
    this.studentTermResultUpdateProvider = studentTermResultUpdateProvider;
    this.studentCalendarResultUpdateProvider = studentCalendarResultUpdateProvider;
    this.studentCalendarResultCreateProvider = studentCalendarResultCreateProvider;
    this.studentCalendarResultReadProvider = studentCalendarResultReadProvider;
    this.studentCalendarResultDeleteProvider = studentCalendarResultDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { finalized, termId, tenantId, calendarId, classId } = args.body;
      const { id } = args.params;

      const updatedStudentTermResult = await this.finalizeStudentTermResultAndUpdateCalendarResults({ finalized, studentId: Number(id), termId, tenantId, calendarId, classId });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_TERM_RESULT_RESOURCE), updatedStudentTermResult);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  private async finalizeStudentTermResultAndUpdateCalendarResults({ studentId, termId, tenantId, finalized, classId, calendarId }: { studentId: number; calendarId: number; classId: number; termId: number; tenantId: number; finalized: boolean }) {
    try {
      const updatedStudentTermResult = await this.studentTermResultUpdateProvider.update({ studentId, termId, tenantId, finalized });

      let studentCalendarResult;
      studentCalendarResult = await this.studentCalendarResultReadProvider.getOneByCriteria({ calendarId, tenantId, studentId });

      if (!studentCalendarResult) {
        studentCalendarResult = await this.studentCalendarResultCreateProvider.create({ studentId, calendarId, classId, classDivisionId: updatedStudentTermResult.classDivisionId, tenantId, finalized, finalizedTermResultsCount: 0 });
      }

      const studentTermResults = await this.studentTermResultReadProvider.getByCriteria({ studentId, termId, tenantId });

      const finalizedTermResultsCount = finalized ? studentCalendarResult.finalizedTermResultsCount + 1 : studentCalendarResult.finalizedTermResultsCount - 1;

      if (finalized) {
        await Promise.all(
          studentTermResults.map((score) =>
            this.studentCalendarResultUpdateProvider.saveTermAverageScores({
              tenantId,
              studentCalendarResultId: studentCalendarResult.id,
              studentCalendarTermAverageScores: score,
            })
          )
        );
      } else {
        await this.studentCalendarResultUpdateProvider.deleteTermAverageScores({
          tenantId,
          studentCalendarResultId: studentCalendarResult.id,
          termId,
        });
      }

      await this.studentCalendarResultUpdateProvider.update({ finalizedTermResultsCount, calendarId, studentId, tenantId });

      return updatedStudentTermResult;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }
}
