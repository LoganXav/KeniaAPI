import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ClassDivisionCreateRequestType } from "../types/ClassDivisionTypes";
import ClassDivisionCreateProvider from "../providers/ClassDivisionCreate.provider";
import { SUCCESS, CLASS_DIVISION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IRequest } from "~/infrastructure/internal/types";

@autoInjectable()
export default class ClassDivisionCreateService extends BaseService<IRequest> {
  static serviceName = "ClassDivisionCreateService";
  private classDivisionCreateProvider: ClassDivisionCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionCreateProvider: ClassDivisionCreateProvider) {
    super(ClassDivisionCreateService.serviceName);
    this.classDivisionCreateProvider = classDivisionCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const classDivision = await this.classDivisionCreateProvider.create({ ...args.body });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivision);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
