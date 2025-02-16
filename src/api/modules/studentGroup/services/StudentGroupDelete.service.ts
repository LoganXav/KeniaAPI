import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { StudentGroupDeleteRequestType } from "../types/StudentGroupTypes";
import StudentGroupDeleteProvider from "../providers/StudentGroupDelete.provider";
import { SUCCESS, STUDENT_GROUP_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class StudentGroupDeleteService extends BaseService<StudentGroupDeleteRequestType> {
  static serviceName = "StudentGroupDeleteService";
  private studentGroupDeleteProvider: StudentGroupDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(studentGroupDeleteProvider: StudentGroupDeleteProvider) {
    super(StudentGroupDeleteService.serviceName);
    this.studentGroupDeleteProvider = studentGroupDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StudentGroupDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const studentGroup = await this.studentGroupDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(STUDENT_GROUP_RESOURCE), studentGroup);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
