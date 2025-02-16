import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentTypeReadRequestType, DocumentTypeReadOneRequestType } from "../types/DocumentTypeTypes";
import DocumentTypeReadProvider from "../providers/DocumentTypeRead.provider";
import { SUCCESS, DOCUMENT_TYPE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentTypeReadService extends BaseService<DocumentTypeReadRequestType> {
  static serviceName = "DocumentTypeReadService";
  private documentTypeReadProvider: DocumentTypeReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentTypeReadProvider: DocumentTypeReadProvider) {
    super(DocumentTypeReadService.serviceName);
    this.documentTypeReadProvider = documentTypeReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentTypeReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documentTypes = await this.documentTypeReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(DOCUMENT_TYPE_RESOURCE), documentTypes);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: DocumentTypeReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documentType = await this.documentTypeReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(DOCUMENT_TYPE_RESOURCE), documentType);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
