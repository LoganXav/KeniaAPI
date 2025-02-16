import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { MedicalHistoryUpdateRequestType } from "../types/MedicalHistoryTypes";
import MedicalHistoryUpdateProvider from "../providers/MedicalHistoryUpdate.provider";
import { SUCCESS, MEDICAL_HISTORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class MedicalHistoryUpdateService extends BaseService<MedicalHistoryUpdateRequestType> {
  static serviceName = "MedicalHistoryUpdateService";
  private medicalHistoryUpdateProvider: MedicalHistoryUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(medicalHistoryUpdateProvider: MedicalHistoryUpdateProvider) {
    super(MedicalHistoryUpdateService.serviceName);
    this.medicalHistoryUpdateProvider = medicalHistoryUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: MedicalHistoryUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const medicalHistory = await this.medicalHistoryUpdateProvider.update(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(MEDICAL_HISTORY_RESOURCE), medicalHistory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
