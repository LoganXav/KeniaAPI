import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { StudentGroupReadRequestType, StudentGroupReadOneRequestType } from "../types/StudentGroupTypes";
import StudentGroupReadProvider from "../providers/StudentGroupRead.provider";
import { SUCCESS, STUDENT_GROUP_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class StudentGroupReadService extends BaseService<StudentGroupReadRequestType> {
  static serviceName = "StudentGroupReadService";
  private studentGroupReadProvider: StudentGroupReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(studentGroupReadProvider: StudentGroupReadProvider) {
    super(StudentGroupReadService.serviceName);
    this.studentGroupReadProvider = studentGroupReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StudentGroupReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const studentGroups = await this.studentGroupReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_GROUP_RESOURCE), studentGroups);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: StudentGroupReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const studentGroup = await this.studentGroupReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_GROUP_RESOURCE), studentGroup);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
