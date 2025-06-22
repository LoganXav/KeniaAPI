import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import RoleCreateProvider from "../providers/RoleCreate.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { SUCCESS, ERROR, ROLE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class RoleCreateService extends BaseService<IRequest> {
  static serviceName = "RoleCreateService";
  loggingProvider: ILoggingDriver;
  private staffReadCache: StaffReadCache;
  private roleCreateProvider: RoleCreateProvider;

  constructor(roleCreateProvider: RoleCreateProvider, staffReadCache: StaffReadCache) {
    super(RoleCreateService.serviceName);
    this.staffReadCache = staffReadCache;
    this.roleCreateProvider = roleCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { staffIds, tenantId } = args.body;

      if (staffIds.length > 0) {
        const staffList = await this.staffReadCache.getByCriteria({ ids: staffIds, tenantId });

        for (const staff of staffList) {
          if (staff?.role?.isAdmin) {
            throw new BadRequestError(`${staff.user?.firstName} ${staff.user?.lastName} is already assigned to an admin role and cannot be reassigned.`);
          }
        }
      }

      const role = await this.roleCreateProvider.createRole(args.body);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_CREATED_SUCCESSFULLY(ROLE_RESOURCE), role);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
