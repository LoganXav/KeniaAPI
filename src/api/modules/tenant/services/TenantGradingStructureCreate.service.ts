import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, TENANT_GRADING_STRUCTURE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import TenantGradingStructureCreateProvider from "~/api/modules/tenant/providers/TenantGradingStructureCreate.provider";

@autoInjectable()
export default class TenantGradingStructureCreateService extends BaseService<IRequest> {
  static serviceName = "TenantGradingStructureCreateService";
  private tenantGradingStructureCreateProvider: TenantGradingStructureCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(tenantGradingStructureCreateProvider: TenantGradingStructureCreateProvider) {
    super(TenantGradingStructureCreateService.serviceName);
    this.tenantGradingStructureCreateProvider = tenantGradingStructureCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      // 1. Extract gradeBoundaries from the request body
      //    (Assuming args.body has a property `gradeBoundaries: GradeBoundaryCreateInput[]`)
      const { gradeBoundaries } = args.body;

      // 2. Run validation if gradeBoundaries is provided
      if (Array.isArray(gradeBoundaries) && gradeBoundaries.length > 0) {
        this.validateGradeBoundaries(gradeBoundaries);
      }

      // 3. If validation passes, delegate to provider
      const gradingStructure = await this.tenantGradingStructureCreateProvider.createOrUpdate(args.body);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TENANT_GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      // If it was a validation error, it should already be a BadRequestError.
      // Otherwise, wrap in InternalServerError for unexpected failures.
      if (error instanceof BadRequestError) {
        this.result.setError(ERROR, error.httpStatusCode || 400, error.message);
        return this.result;
      }

      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description || error.message);
      return this.result;
    }
  }

  /**
   * Ensure that:
   *  1. minimumScore <= maximumScore for each boundary
   *  2. No two boundaries overlap (i.e., ranges are strictly disjoint)
   */
  private validateGradeBoundaries(
    boundaries: Array<{
      minimumScore: number;
      maximumScore: number;
      grade: string;
      remark: string;
    }>
  ) {
    // (a) Check each individual boundary’s min ≤ max
    for (const { minimumScore, maximumScore, grade } of boundaries) {
      if (minimumScore > maximumScore) {
        throw new BadRequestError(`Grade boundary for "${grade}" has minimumScore (${minimumScore}) > maximumScore (${maximumScore}).`);
      }
    }

    // (b) Sort boundaries by minimumScore ascending
    const sorted = [...boundaries].sort((a, b) => a.minimumScore - b.minimumScore);

    // (c) Walk through sorted array and ensure no overlap between adjacent ranges
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      // If the current minimumScore is ≤ previous maximumScore, there is an overlap
      if (curr.minimumScore <= prev.maximumScore) {
        throw new BadRequestError(
          `Grade boundaries overlap: 
           "${prev.grade}" covers ${prev.minimumScore}-${prev.maximumScore}, 
           but "${curr.grade}" starts at ${curr.minimumScore}.`
        );
      }
    }

    // If we reach here, all boundaries are non-overlapping and well‐formed
  }
}
