import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassReadRequestType, ClassReadOneRequestType } from "../types/ClassTypes";
import ClassReadProvider from "../providers/ClassRead.provider";
import { SUCCESS, CLASS_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_UPDATED_SUCCESSFULLY, RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import ClassReadCache from "../cache/ClassRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
@autoInjectable()
export default class ClassReadService extends BaseService<IRequest> {
  static serviceName = "ClassReadService";
  private classReadProvider: ClassReadProvider;
  private classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;

  constructor(classReadProvider: ClassReadProvider, classReadCache: ClassReadCache) {
    super(ClassReadService.serviceName);
    this.classReadProvider = classReadProvider;
    this.classReadCache = classReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const classes = await this.classReadCache.getByCriteria(args?.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(CLASS_RESOURCE), classes);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.params);

      const criteria = { id: Number(args.params.id), ...args.body };

      const classRecord = await this.classReadCache.getOneByCriteria(criteria);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(CLASS_RESOURCE), classRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
