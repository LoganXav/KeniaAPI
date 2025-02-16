import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentTypeUpdateRequestType } from "../types/DocumentTypeTypes";
import DocumentTypeUpdateProvider from "../providers/DocumentTypeUpdate.provider";
import { SUCCESS, DOCUMENT_TYPE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentTypeUpdateService extends BaseService<DocumentTypeUpdateRequestType> {
  static serviceName = "DocumentTypeUpdateService";
  private documentTypeUpdateProvider: DocumentTypeUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentTypeUpdateProvider: DocumentTypeUpdateProvider) {
    super(DocumentTypeUpdateService.serviceName);
    this.documentTypeUpdateProvider = documentTypeUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentTypeUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documentType = await this.documentTypeUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(DOCUMENT_TYPE_RESOURCE), documentType);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
