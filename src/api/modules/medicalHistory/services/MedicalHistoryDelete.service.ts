import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { MedicalHistoryDeleteRequestType } from "../types/MedicalHistoryTypes";
import MedicalHistoryDeleteProvider from "../providers/MedicalHistoryDelete.provider";
import { SUCCESS, MEDICAL_HISTORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class MedicalHistoryDeleteService extends BaseService<MedicalHistoryDeleteRequestType> {
  static serviceName = "MedicalHistoryDeleteService";
  private medicalHistoryDeleteProvider: MedicalHistoryDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(medicalHistoryDeleteProvider: MedicalHistoryDeleteProvider) {
    super(MedicalHistoryDeleteService.serviceName);
    this.medicalHistoryDeleteProvider = medicalHistoryDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: MedicalHistoryDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const medicalHistory = await this.medicalHistoryDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(MEDICAL_HISTORY_RESOURCE), medicalHistory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
