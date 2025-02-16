import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassDivisionDeleteRequestType } from "../types/ClassDivisionTypes";
import ClassDivisionDeleteProvider from "../providers/ClassDivisionDelete.provider";
import { SUCCESS, CLASS_DIVISION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class ClassDivisionDeleteService extends BaseService<ClassDivisionDeleteRequestType> {
  static serviceName = "ClassDivisionDeleteService";
  private classDivisionDeleteProvider: ClassDivisionDeleteProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionDeleteProvider: ClassDivisionDeleteProvider) {
    super(ClassDivisionDeleteService.serviceName);
    this.classDivisionDeleteProvider = classDivisionDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: ClassDivisionDeleteRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classDivision = await this.classDivisionDeleteProvider.delete(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivision);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
