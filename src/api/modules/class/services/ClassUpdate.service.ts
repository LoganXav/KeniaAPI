import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassUpdateRequestType } from "../types/ClassTypes";
import ClassUpdateProvider from "../providers/ClassUpdate.provider";
import { SUCCESS, CLASS_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class ClassUpdateService extends BaseService<ClassUpdateRequestType> {
  static serviceName = "ClassUpdateService";
  private classUpdateProvider: ClassUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(classUpdateProvider: ClassUpdateProvider) {
    super(ClassUpdateService.serviceName);
    this.classUpdateProvider = classUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: ClassUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classRecord = await this.classUpdateProvider.updateOne(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(CLASS_RESOURCE), classRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
