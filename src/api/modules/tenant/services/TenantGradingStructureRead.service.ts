import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, TENANT_GRADING_STRUCTURE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import TenantGradingStructureReadProvider from "~/api/modules/tenant/providers/TenantGradingStructureRead.provider";

@autoInjectable()
export default class TenantGradingStructureReadService extends BaseService<IRequest> {
  static serviceName = "TenantGradingStructureReadService";
  private tenantGradingStructureReadProvider: TenantGradingStructureReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(tenantGradingStructureReadProvider: TenantGradingStructureReadProvider) {
    super(TenantGradingStructureReadService.serviceName);
    this.tenantGradingStructureReadProvider = tenantGradingStructureReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const gradingStructure = await this.tenantGradingStructureReadProvider.getByCriteria(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TENANT_GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const { id } = args.params;

      const gradingStructure = await this.tenantGradingStructureReadProvider.getOneByCriteria({ id: Number(id), ...args.body });

      if (!gradingStructure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(TENANT_GRADING_STRUCTURE_RESOURCE));
      }
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TENANT_GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
