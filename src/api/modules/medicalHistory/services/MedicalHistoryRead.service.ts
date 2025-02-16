import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { MedicalHistoryReadRequestType, MedicalHistoryReadOneRequestType } from "../types/MedicalHistoryTypes";
import MedicalHistoryReadProvider from "../providers/MedicalHistoryRead.provider";
import { SUCCESS, MEDICAL_HISTORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class MedicalHistoryReadService extends BaseService<MedicalHistoryReadRequestType> {
  static serviceName = "MedicalHistoryReadService";
  private medicalHistoryReadProvider: MedicalHistoryReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(medicalHistoryReadProvider: MedicalHistoryReadProvider) {
    super(MedicalHistoryReadService.serviceName);
    this.medicalHistoryReadProvider = medicalHistoryReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: MedicalHistoryReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const medicalHistories = await this.medicalHistoryReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(MEDICAL_HISTORY_RESOURCE), medicalHistories);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: MedicalHistoryReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const medicalHistory = await this.medicalHistoryReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(MEDICAL_HISTORY_RESOURCE), medicalHistory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
