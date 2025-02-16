import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DocumentUpdateRequestType } from "../types/DocumentTypes";
import DocumentUpdateProvider from "../providers/DocumentUpdate.provider";
import { SUCCESS, DOCUMENT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DocumentUpdateService extends BaseService<DocumentUpdateRequestType> {
  static serviceName = "DocumentUpdateService";
  private documentUpdateProvider: DocumentUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(documentUpdateProvider: DocumentUpdateProvider) {
    super(DocumentUpdateService.serviceName);
    this.documentUpdateProvider = documentUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DocumentUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const document = await this.documentUpdateProvider.update(args);
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
