import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SubjectUpdateRequestType } from "../types/SubjectTypes";
import SubjectUpdateProvider from "../providers/SubjectUpdate.provider";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class SubjectUpdateService extends BaseService<SubjectUpdateRequestType> {
  static serviceName = "SubjectUpdateService";
  private subjectUpdateProvider: SubjectUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectUpdateProvider: SubjectUpdateProvider) {
    super(SubjectUpdateService.serviceName);
    this.subjectUpdateProvider = subjectUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SubjectUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const subject = await this.subjectUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
