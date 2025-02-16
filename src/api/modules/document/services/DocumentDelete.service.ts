import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentDeleteRequestType } from "../types/DocumentTypes";
import DocumentDeleteProvider from "../providers/DocumentDelete.provider";
import { SUCCESS, DOCUMENT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentDeleteService extends BaseService<DocumentDeleteRequestType> {
  static serviceName = "DocumentDeleteService";
  private documentDeleteProvider: DocumentDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentDeleteProvider: DocumentDeleteProvider) {
    super(DocumentDeleteService.serviceName);
    this.documentDeleteProvider = documentDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const document = await this.documentDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(DOCUMENT_RESOURCE), document);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
