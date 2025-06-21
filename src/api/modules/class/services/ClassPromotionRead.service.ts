import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import ClassPromotionReadProvider from "~/api/modules/class/providers/ClassPromotionRead.provider";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, CLASS_PROMOTION_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class ClassPromotionReadService extends BaseService<IRequest> {
  static serviceName = "ClassPromotionReadService";
  private classPromotionReadProvider: ClassPromotionReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(classPromotionReadProvider: ClassPromotionReadProvider) {
    super(ClassPromotionReadService.serviceName);
    this.classPromotionReadProvider = classPromotionReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);

      const { calendarId, classId, classDivisionId } = args.query;

      const classPromotions = await this.classPromotionReadProvider.getByCriteria({ calendarId: Number(calendarId), classDivisionId: Number(classDivisionId), classId: Number(classId), tenantId: args.body.tenantId });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(CLASS_PROMOTION_RESOURCE), classPromotions);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
