import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SubjectDeleteRequestType } from "../types/SubjectTypes";
import SubjectDeleteProvider from "../providers/SubjectDelete.provider";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class SubjectDeleteService extends BaseService<SubjectDeleteRequestType> {
  static serviceName = "SubjectDeleteService";
  private subjectDeleteProvider: SubjectDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectDeleteProvider: SubjectDeleteProvider) {
    super(SubjectDeleteService.serviceName);
    this.subjectDeleteProvider = subjectDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SubjectDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const subject = await this.subjectDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
