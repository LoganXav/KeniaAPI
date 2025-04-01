import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassReadCache from "../../class/cache/ClassRead.cache";
import StaffReadCache from "../../staff/cache/StaffRead.cache";

@autoInjectable()
export default class SubjectTemplateService extends BaseService<IRequest> {
  static serviceName = "SubjectTemplateService";
  loggingProvider: ILoggingDriver;
  staffReadCache: StaffReadCache;
  classReadCache: ClassReadCache;

  constructor(staffReadCache: StaffReadCache, classReadCache: ClassReadCache) {
    super(SubjectTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.staffReadCache = staffReadCache;
    this.classReadCache = classReadCache;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);

      const staffs = await this.staffReadCache.getByCriteria({
        tenantId: args.body.tenantId,
      });

      const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });

      const data = {
        staffOptions: staffs,
        classOptions: classes,
      };

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TEMPLATE_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
