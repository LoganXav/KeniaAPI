import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SubjectCreateRequestType } from "../types/SubjectTypes";
import SubjectCreateProvider from "../providers/SubjectCreate.provider";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class SubjectCreateService extends BaseService<SubjectCreateRequestType> {
  static serviceName = "SubjectCreateService";
  private subjectCreateProvider: SubjectCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectCreateProvider: SubjectCreateProvider) {
    super(SubjectCreateService.serviceName);
    this.subjectCreateProvider = subjectCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SubjectCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const subject = await this.subjectCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
