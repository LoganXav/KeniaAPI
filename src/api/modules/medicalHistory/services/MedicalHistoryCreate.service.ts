import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { MedicalHistoryCreateRequestType } from "../types/MedicalHistoryTypes";
import MedicalHistoryCreateProvider from "../providers/MedicalHistoryCreate.provider";
import { SUCCESS, MEDICAL_HISTORY_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class MedicalHistoryCreateService extends BaseService<MedicalHistoryCreateRequestType> {
  static serviceName = "MedicalHistoryCreateService";
  private medicalHistoryCreateProvider: MedicalHistoryCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(medicalHistoryCreateProvider: MedicalHistoryCreateProvider) {
    super(MedicalHistoryCreateService.serviceName);
    this.medicalHistoryCreateProvider = medicalHistoryCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: MedicalHistoryCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const medicalHistory = await this.medicalHistoryCreateProvider.create(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(MEDICAL_HISTORY_RESOURCE), medicalHistory);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
