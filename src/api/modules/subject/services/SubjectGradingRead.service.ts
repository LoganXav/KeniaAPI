import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import SubjectGradingReadProvider from "~/api/modules/subject/providers/SubjectGradingRead.provider";
import { SUCCESS, SUBJECT_GRADING_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class SubjectGradingReadService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingReadService";
  private subjectGradingReadProvider: SubjectGradingReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectGradingReadProvider: SubjectGradingReadProvider) {
    super(SubjectGradingReadService.serviceName);
    this.subjectGradingReadProvider = subjectGradingReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { calendarId, classId, termId, classDivisionId, subjectId } = args.query;

      const grades = await this.subjectGradingReadProvider.getByCriteria({ subjectId: Number(subjectId), calendarId: Number(calendarId), classId: Number(classId), termId: Number(termId), classDivisionId: Number(classDivisionId), ...args.body });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_GRADING_RESOURCE), grades);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { id } = args.params;

      const { subjectId, calendarId, classId, termId, classDivisionId, studentId } = args.query;

      const grades = await this.subjectGradingReadProvider.getOneByCriteria({ id: Number(id), subjectId: Number(subjectId), calendarId: Number(calendarId), classId: Number(classId), termId: Number(termId), classDivisionId: Number(classDivisionId), studentId: Number(studentId), ...args.body });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_GRADING_RESOURCE), grades);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }
}
