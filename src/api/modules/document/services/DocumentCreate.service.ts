import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentCreateRequestType } from "../types/DocumentTypes";
import DocumentCreateProvider from "../providers/DocumentCreate.provider";
import { SUCCESS, DOCUMENT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentCreateService extends BaseService<DocumentCreateRequestType> {
  static serviceName = "DocumentCreateService";
  private documentCreateProvider: DocumentCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentCreateProvider: DocumentCreateProvider) {
    super(DocumentCreateService.serviceName);
    this.documentCreateProvider = documentCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const document = await this.documentCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(DOCUMENT_RESOURCE), document);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
