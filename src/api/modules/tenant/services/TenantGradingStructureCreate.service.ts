import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
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
      this.initializeServiceTrace(trace, args);

      const gradingStructure = await this.tenantGradingStructureCreateProvider.createOrUpdate(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TENANT_GRADING_STRUCTURE_RESOURCE), gradingStructure);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
