import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassDivisionReadRequestType, ClassDivisionReadOneRequestType } from "../types/ClassDivisionTypes";
import ClassDivisionReadProvider from "../providers/ClassDivisionRead.provider";
import { SUCCESS, CLASS_DIVISION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

@autoInjectable()
export default class ClassDivisionReadService extends BaseService<ClassDivisionReadRequestType> {
  static serviceName = "ClassDivisionReadService";
  private classDivisionReadProvider: ClassDivisionReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionReadProvider: ClassDivisionReadProvider) {
    super(ClassDivisionReadService.serviceName);
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: ClassDivisionReadRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classDivisions = await this.classDivisionReadProvider.getByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivisions);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: ClassDivisionReadOneRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classDivision = await this.classDivisionReadProvider.getOneByCriteria(args);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivision);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
