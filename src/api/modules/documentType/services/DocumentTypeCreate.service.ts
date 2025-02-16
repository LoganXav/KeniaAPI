import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentTypeCreateRequestType } from "../types/DocumentTypeTypes";
import DocumentTypeCreateProvider from "../providers/DocumentTypeCreate.provider";
import { SUCCESS, DOCUMENT_TYPE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentTypeCreateService extends BaseService<DocumentTypeCreateRequestType> {
  static serviceName = "DocumentTypeCreateService";
  private documentTypeCreateProvider: DocumentTypeCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentTypeCreateProvider: DocumentTypeCreateProvider) {
    super(DocumentTypeCreateService.serviceName);
    this.documentTypeCreateProvider = documentTypeCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentTypeCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documentType = await this.documentTypeCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(DOCUMENT_TYPE_RESOURCE), documentType);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
