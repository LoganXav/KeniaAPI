import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SubjectReadRequestType, SubjectReadOneRequestType } from "../types/SubjectTypes";
import SubjectReadProvider from "../providers/SubjectRead.provider";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class SubjectReadService extends BaseService<SubjectReadRequestType> {
  static serviceName = "SubjectReadService";
  private subjectReadProvider: SubjectReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectReadProvider: SubjectReadProvider) {
    super(SubjectReadService.serviceName);
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SubjectReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const subjects = await this.subjectReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_RESOURCE), subjects);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: SubjectReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const subject = await this.subjectReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
