import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DormitoryDeleteRequestType } from "../types/DormitoryTypes";
import DormitoryDeleteProvider from "../providers/DormitoryDelete.provider";
import { SUCCESS, DORMITORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DormitoryDeleteService extends BaseService<DormitoryDeleteRequestType> {
  static serviceName = "DormitoryDeleteService";
  private dormitoryDeleteProvider: DormitoryDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(dormitoryDeleteProvider: DormitoryDeleteProvider) {
    super(DormitoryDeleteService.serviceName);
    this.dormitoryDeleteProvider = dormitoryDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DormitoryDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const dormitory = await this.dormitoryDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(DORMITORY_RESOURCE), dormitory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
