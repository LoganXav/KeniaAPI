import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, GRADING_STRUCTURE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import SubjectGradingStructureReadProvider from "~/api/modules/subject/providers/SubjectGradingStructureRead.provider";

@autoInjectable()
export default class SubjectGradingStructureReadService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingStructureReadService";
  private subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider) {
    super(SubjectGradingStructureReadService.serviceName);
    this.subjectGradingStructureReadProvider = subjectGradingStructureReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const gradingStructures = await this.subjectGradingStructureReadProvider.getByCriteria(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(GRADING_STRUCTURE_RESOURCE), gradingStructures);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { id } = args.params;

      const gradingStructure = await this.subjectGradingStructureReadProvider.getOneByCriteria({ id: Number(id), ...args.body });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }
}
