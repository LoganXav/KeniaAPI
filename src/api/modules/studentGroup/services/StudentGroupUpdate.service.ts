import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { StudentGroupUpdateRequestType } from "../types/StudentGroupTypes";
import StudentGroupUpdateProvider from "../providers/StudentGroupUpdate.provider";
import { SUCCESS, STUDENT_GROUP_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class StudentGroupUpdateService extends BaseService<StudentGroupUpdateRequestType> {
  static serviceName = "StudentGroupUpdateService";
  private studentGroupUpdateProvider: StudentGroupUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(studentGroupUpdateProvider: StudentGroupUpdateProvider) {
    super(StudentGroupUpdateService.serviceName);
    this.studentGroupUpdateProvider = studentGroupUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StudentGroupUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const studentGroup = await this.studentGroupUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_GROUP_RESOURCE), studentGroup);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
