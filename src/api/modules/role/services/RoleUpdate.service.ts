import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import RoleReadProvider from "../providers/RoleRead.provider";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import RoleUpdateProvider from "../providers/RoleUpdate.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, ERROR, ROLE_RESOURCE, SCHOOL_OWNER_ROLE_NAME } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_CANNOT_BE_UPDATED, RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class RoleUpdateService extends BaseService<IRequest> {
  static serviceName = "RoleUpdateService";
  loggingProvider: ILoggingDriver;
  private staffReadCache: StaffReadCache;
  private roleReadProvider: RoleReadProvider;
  private roleUpdateProvider: RoleUpdateProvider;

  constructor(staffReadCache: StaffReadCache, roleUpdateProvider: RoleUpdateProvider, roleReadProvider: RoleReadProvider) {
    super(RoleUpdateService.serviceName);
    this.staffReadCache = staffReadCache;
    this.roleReadProvider = roleReadProvider;
    this.roleUpdateProvider = roleUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, staffIds } = args.body;

      const { id } = args.params;

      const foundRole = await this.roleReadProvider.getOneByCriteria({ tenantId: args.body.tenantId, id: Number(id) });

      if (!foundRole) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(ROLE_RESOURCE));
      }

      if (foundRole.isAdmin) {
        throw new BadRequestError(RESOURCE_RECORD_CANNOT_BE_UPDATED(SCHOOL_OWNER_ROLE_NAME));
      }

      if (staffIds.length > 0) {
        const staffList = await this.staffReadCache.getByCriteria({ ids: staffIds, tenantId });

        for (const staff of staffList) {
          if (staff?.role?.isAdmin) {
            throw new BadRequestError(`Staff ${staff.user?.firstName} ${staff.user?.lastName} is already assigned to an admin role and cannot be reassigned.`);
          }
        }
      }

      const role = await this.roleUpdateProvider.updateOne({ id: Number(id), ...args.body });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(ROLE_RESOURCE), role);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
