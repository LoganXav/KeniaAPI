import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassDeleteRequestType } from "../types/ClassTypes";
import ClassDeleteProvider from "../providers/ClassDelete.provider";
import { SUCCESS, CLASS_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class ClassDeleteService extends BaseService<ClassDeleteRequestType> {
  static serviceName = "ClassDeleteService";
  private classDeleteProvider: ClassDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDeleteProvider: ClassDeleteProvider) {
    super(ClassDeleteService.serviceName);
    this.classDeleteProvider = classDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: ClassDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classRecord = await this.classDeleteProvider.deleteOne(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(CLASS_RESOURCE), classRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
