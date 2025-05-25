import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import TenantGradingStructureReadProvider from "~/api/modules/tenant/providers/TenantGradingStructureRead.provider";
import SubjectGradingStructureReadProvider from "~/api/modules/subject/providers/SubjectGradingStructureRead.provider";
import SubjectGradingStructureCreateProvider from "~/api/modules/subject/providers/SubjectGradingStructureCreate.provider";
import { SUCCESS, ERROR, SUBJECT_GRADING_STRUCTURE_RESOURCE, TENANT_GRADING_STRUCTURE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SubjectGradingStructureCreateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingStructureCreateService";
  private tenantGradingStructureReadProvider: TenantGradingStructureReadProvider;
  private subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider;
  private subjectGradingStructureCreateProvider: SubjectGradingStructureCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectGradingStructureCreateProvider: SubjectGradingStructureCreateProvider, tenantGradingStructureReadProvider: TenantGradingStructureReadProvider, subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider) {
    super(SubjectGradingStructureCreateService.serviceName);
    this.tenantGradingStructureReadProvider = tenantGradingStructureReadProvider;
    this.subjectGradingStructureReadProvider = subjectGradingStructureReadProvider;
    this.subjectGradingStructureCreateProvider = subjectGradingStructureCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { id, subjectId, tenantId, continuousAssessmentBreakdownItems } = args.body;

      const foundExistingSubjectGradingStructure = await this.subjectGradingStructureReadProvider.getOneByCriteria({ subjectId, tenantId });
      if (!id && foundExistingSubjectGradingStructure) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(SUBJECT_GRADING_STRUCTURE_RESOURCE));
      }

      // Fetch the tenant grading structure
      const tenantGradingStructure = await this.tenantGradingStructureReadProvider.getOneByCriteria(args.body);
      if (!tenantGradingStructure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(TENANT_GRADING_STRUCTURE_RESOURCE));
      }

      // Calculate total weight of Continuous Assessment breakdown items
      const totalWeight = continuousAssessmentBreakdownItems.reduce((sum: number, item: { name: string; weight: number }) => sum + item.weight, 0);

      // Validate that total weight matches the tenant's Continuous Assessment weight
      if (totalWeight !== tenantGradingStructure.continuousAssessmentWeight) {
        throw new BadRequestError(`Total weight of continuous assessment must equal the allocated continuous assessment weight (${tenantGradingStructure.continuousAssessmentWeight})`);
      }

      const gradingStructure = await this.subjectGradingStructureCreateProvider.createOrUpdate(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }
}
