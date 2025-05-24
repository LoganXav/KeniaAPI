import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import TenantGradingStructureReadProvider from "~/api/modules/tenant/providers/TenantGradingStructureRead.provider";
import SubjectGradingStructureCreateProvider from "~/api/modules/subject/providers/SubjectGradingStructureCreate.provider";
import { SUCCESS, GRADING_STRUCTURE_RESOURCE, ERROR, SUBJECT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SubjectGradingStructureCreateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingStructureCreateService";
  private tenantGradingStructureReadProvider: TenantGradingStructureReadProvider;
  private subjectGradingStructureCreateProvider: SubjectGradingStructureCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectGradingStructureCreateProvider: SubjectGradingStructureCreateProvider, tenantGradingStructureReadProvider: TenantGradingStructureReadProvider) {
    super(SubjectGradingStructureCreateService.serviceName);
    this.subjectGradingStructureCreateProvider = subjectGradingStructureCreateProvider;
    this.tenantGradingStructureReadProvider = tenantGradingStructureReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { continuousAssessmentBreakdownItems } = args.body;

      // Fetch the tenant grading structure
      const tenantGradingStructure = await this.tenantGradingStructureReadProvider.getOneByCriteria(args.body);
      if (!tenantGradingStructure) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_RESOURCE));
      }

      // Calculate total weight of Continuous Assessment breakdown items
      const totalWeight = continuousAssessmentBreakdownItems.reduce((sum: number, item: { name: string; weight: number }) => sum + item.weight, 0);

      // Validate that total weight matches the tenant's  Continuous Assessment weight
      if (totalWeight !== tenantGradingStructure.continuousAssessmentWeight) {
        throw new BadRequestError(`Total weight of continuous assessment must equal the allocated continuous assessment weight (${tenantGradingStructure.continuousAssessmentWeight})`);
      }

      const gradingStructure = await this.subjectGradingStructureCreateProvider.create(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }
}
