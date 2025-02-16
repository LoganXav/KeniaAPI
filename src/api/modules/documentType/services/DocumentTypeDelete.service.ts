import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentTypeDeleteRequestType } from "../types/DocumentTypeTypes";
import DocumentTypeDeleteProvider from "../providers/DocumentTypeDelete.provider";
import { SUCCESS, DOCUMENT_TYPE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentTypeDeleteService extends BaseService<DocumentTypeDeleteRequestType> {
  static serviceName = "DocumentTypeDeleteService";
  private documentTypeDeleteProvider: DocumentTypeDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentTypeDeleteProvider: DocumentTypeDeleteProvider) {
    super(DocumentTypeDeleteService.serviceName);
    this.documentTypeDeleteProvider = documentTypeDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentTypeDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documentType = await this.documentTypeDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(DOCUMENT_TYPE_RESOURCE), documentType);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
