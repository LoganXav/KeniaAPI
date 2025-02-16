import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DormitoryUpdateRequestType } from "../types/DormitoryTypes";
import DormitoryUpdateProvider from "../providers/DormitoryUpdate.provider";
import { SUCCESS, DORMITORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DormitoryUpdateService extends BaseService<DormitoryUpdateRequestType> {
  static serviceName = "DormitoryUpdateService";
  private dormitoryUpdateProvider: DormitoryUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(dormitoryUpdateProvider: DormitoryUpdateProvider) {
    super(DormitoryUpdateService.serviceName);
    this.dormitoryUpdateProvider = dormitoryUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DormitoryUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const dormitory = await this.dormitoryUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(DORMITORY_RESOURCE), dormitory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
