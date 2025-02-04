import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, NULL_OBJECT, SUCCESS, TENANT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { IRequest } from "~/infrastructure/internal/types";
import TenantReadProvider from "../providers/TenantRead.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";

@autoInjectable()
export default class TenantReadService extends BaseService<IRequest> {
  static serviceName = "TenantReadService";
  loggingProvider: ILoggingDriver;
  tenantReadProvider: TenantReadProvider;
  constructor(tenantReadProvider: TenantReadProvider) {
    super(TenantReadService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.tenantReadProvider = tenantReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { tenantId } = args.body;

      const foundTenant = await this.tenantReadProvider.getOneByCriteria({ id: Number(tenantId) });

      if (foundTenant === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(TENANT_RESOURCE));
      }

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TENANT_RESOURCE), foundTenant);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
