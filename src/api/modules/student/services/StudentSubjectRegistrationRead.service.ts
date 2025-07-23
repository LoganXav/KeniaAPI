import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { SUCCESS, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import StudentSubjectRegistrationReadProvider from "../providers/StudentSubjectRegistrationRead.provider";

@autoInjectable()
export default class StudentSubjectRegistrationReadService extends BaseService<IRequest> {
  static serviceName = "StudentSubjectRegistrationReadService";
  loggingProvider: ILoggingDriver;
  studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider;

  constructor(studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider) {
    super(StudentSubjectRegistrationReadService.serviceName);
    this.studentSubjectRegistrationReadProvider = studentSubjectRegistrationReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const { tenantId } = args.body;
      const { subjectId, calendarId, classId, status } = args.query;

      const students = await this.studentSubjectRegistrationReadProvider.getByCriteria({ tenantId: Number(tenantId), subjectId: Number(subjectId), calendarId: Number(calendarId), classId: Number(classId), status });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_RESOURCE), students);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
