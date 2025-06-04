import { autoInjectable } from "tsyringe";
import ClassReadCache from "../cache/ClassRead.cache";
import { ClassCreateRequestType } from "../types/ClassTypes";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import ClassCreateProvider from "../providers/ClassCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { SUCCESS, CLASS_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_ALREADY_EXISTS } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
@autoInjectable()
export default class ClassCreateService extends BaseService<ClassCreateRequestType> {
  static serviceName = "ClassCreateService";
  private classCreateProvider: ClassCreateProvider;
  private classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;

  constructor(classCreateProvider: ClassCreateProvider, classReadCache: ClassReadCache) {
    super(ClassCreateService.serviceName);
    this.classCreateProvider = classCreateProvider;
    this.classReadCache = classReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: ClassCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundClass = await this.classReadCache.getOneByCriteria(args);

      if (foundClass) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(CLASS_RESOURCE));
      }

      const classRecord = await this.classCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(CLASS_RESOURCE), classRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
