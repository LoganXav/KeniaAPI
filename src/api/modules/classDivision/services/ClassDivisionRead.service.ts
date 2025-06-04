import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import ClassDivisionReadProvider from "../providers/ClassDivisionRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, CLASS_DIVISION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class ClassDivisionReadService extends BaseService<IRequest> {
  static serviceName = "ClassDivisionReadService";
  private classDivisionReadProvider: ClassDivisionReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionReadProvider: ClassDivisionReadProvider) {
    super(ClassDivisionReadService.serviceName);
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const { classTeacherId } = args.query;

      const classDivisions = await this.classDivisionReadProvider.getByCriteria({ classTeacherId: Number(classTeacherId), ...args?.body });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivisions);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const classDivision = await this.classDivisionReadProvider.getOneByCriteria({ ...args.body, id: Number(args.params.id) });

      if (!classDivision) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(CLASS_DIVISION_RESOURCE));
      }

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(CLASS_DIVISION_RESOURCE), classDivision);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
