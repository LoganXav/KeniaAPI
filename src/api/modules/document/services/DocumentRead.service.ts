import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentReadRequestType, DocumentReadOneRequestType } from "../types/DocumentTypes";
import DocumentReadProvider from "../providers/DocumentRead.provider";
import { SUCCESS, DOCUMENT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentReadService extends BaseService<DocumentReadRequestType> {
  static serviceName = "DocumentReadService";
  private documentReadProvider: DocumentReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentReadProvider: DocumentReadProvider) {
    super(DocumentReadService.serviceName);
    this.documentReadProvider = documentReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const documents = await this.documentReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(DOCUMENT_RESOURCE), documents);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: DocumentReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const document = await this.documentReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(DOCUMENT_RESOURCE), document);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
