import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { StudentGroupCreateRequestType } from "../types/StudentGroupTypes";
import StudentGroupCreateProvider from "../providers/StudentGroupCreate.provider";
import { SUCCESS, STUDENT_GROUP_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class StudentGroupCreateService extends BaseService<StudentGroupCreateRequestType> {
  static serviceName = "StudentGroupCreateService";
  private studentGroupCreateProvider: StudentGroupCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(studentGroupCreateProvider: StudentGroupCreateProvider) {
    super(StudentGroupCreateService.serviceName);
    this.studentGroupCreateProvider = studentGroupCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StudentGroupCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const studentGroup = await this.studentGroupCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STUDENT_GROUP_RESOURCE), studentGroup);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
