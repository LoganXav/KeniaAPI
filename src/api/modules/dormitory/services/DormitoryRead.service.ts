import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DormitoryReadRequestType, DormitoryReadOneRequestType } from "../types/DormitoryTypes";
import DormitoryReadProvider from "../providers/DormitoryRead.provider";
import { SUCCESS, DORMITORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DormitoryReadService extends BaseService<DormitoryReadRequestType> {
  static serviceName = "DormitoryReadService";
  private dormitoryReadProvider: DormitoryReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(dormitoryReadProvider: DormitoryReadProvider) {
    super(DormitoryReadService.serviceName);
    this.dormitoryReadProvider = dormitoryReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DormitoryReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const dormitories = await this.dormitoryReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(DORMITORY_RESOURCE), dormitories);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: DormitoryReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const dormitory = await this.dormitoryReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(DORMITORY_RESOURCE), dormitory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
