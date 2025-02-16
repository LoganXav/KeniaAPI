import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { DormitoryCreateRequestType } from "../types/DormitoryTypes";
import DormitoryCreateProvider from "../providers/DormitoryCreate.provider";
import { SUCCESS, DORMITORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class DormitoryCreateService extends BaseService<DormitoryCreateRequestType> {
  static serviceName = "DormitoryCreateService";
  private dormitoryCreateProvider: DormitoryCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(dormitoryCreateProvider: DormitoryCreateProvider) {
    super(DormitoryCreateService.serviceName);
    this.dormitoryCreateProvider = dormitoryCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: DormitoryCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const dormitory = await this.dormitoryCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(DORMITORY_RESOURCE), dormitory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
