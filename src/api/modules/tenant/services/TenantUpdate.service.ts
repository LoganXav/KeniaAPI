import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import TenantUpdateProvider from "../providers/TenantUpdate.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SUCCESS, TENANT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { TenantUpdateSchemaType } from "../types/TenantTypes";

@autoInjectable()
export default class TenantUpdateService extends BaseService<TenantUpdateSchemaType> {
  static serviceName = "TenantUpdateService";
  loggingProvider: ILoggingDriver;
  tenantUpdateProvider: TenantUpdateProvider;
  constructor(tenantUpdateProvider: TenantUpdateProvider) {
    super(TenantUpdateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.tenantUpdateProvider = tenantUpdateProvider;
  }

  public async execute(trace: ServiceTrace, args: TenantUpdateSchemaType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      await this.tenantUpdateProvider.updateOneByCriteria(args);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(TENANT_RESOURCE), {});
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
