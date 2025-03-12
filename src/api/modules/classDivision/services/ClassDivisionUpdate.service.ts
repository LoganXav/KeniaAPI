import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import ClassDivisionUpdateProvider from "../providers/ClassDivisionUpdate.provider";
import { SUCCESS, CLASS_DIVISION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IRequest } from "~/infrastructure/internal/types";

@autoInjectable()
export default class ClassDivisionUpdateService extends BaseService<IRequest> {
  static serviceName = "ClassDivisionUpdateService";
  private classDivisionUpdateProvider: ClassDivisionUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionUpdateProvider: ClassDivisionUpdateProvider) {
    super(ClassDivisionUpdateService.serviceName);
    this.classDivisionUpdateProvider = classDivisionUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const classDivision = await this.classDivisionUpdateProvider.update({ ...args.body, id: Number(args.params.id) });
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
