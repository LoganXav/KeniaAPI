import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import PermissionReadProvider from "../../permission/providers/PermissionRead.provider";
import { SUCCESS, ERROR, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class RoleTemplateService extends BaseService<IRequest> {
  static serviceName = "RoleTemplateService";
  staffReadCache: StaffReadCache;
  loggingProvider: ILoggingDriver;
  permissionReadProvider: PermissionReadProvider;

  constructor(permissionReadProvider: PermissionReadProvider, staffReadCache: StaffReadCache) {
    super(RoleTemplateService.serviceName);
    this.staffReadCache = staffReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
    this.permissionReadProvider = permissionReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const staffs = await this.staffReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const permissions = await this.permissionReadProvider.getByCriteria(args.body);

      const template = {
        staffOptions: staffs,
        scopeOptions: [],
        permissionsOptions: permissions,
      };

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TEMPLATE_RESOURCE), template);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
