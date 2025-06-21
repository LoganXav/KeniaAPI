import { autoInjectable } from "tsyringe";
import { PromotionStatus } from "@prisma/client";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentReadCache from "~/api/modules/student/cache/StudentRead.cache";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassDivisionReadProvider from "~/api/modules/classDivision/providers/ClassDivisionRead.provider";
import SchoolCalendarReadProvider from "~/api/modules/schoolCalendar/providers/SchoolCalendarRead.provider";

@autoInjectable()
export default class ClassPromotionTemplateService extends BaseService<IRequest> {
  static serviceName = "ClassPromotionTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  studentReadCache: StudentReadCache;
  calendarReadProvider: SchoolCalendarReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;

  constructor(classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, calendarReadProvider: SchoolCalendarReadProvider, studentReadCache: StudentReadCache) {
    super(ClassPromotionTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.classReadCache = classReadCache;
    this.studentReadCache = studentReadCache;
    this.calendarReadProvider = calendarReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { classId, classDivisionId } = args.query;

      const classOptions = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivisionOptions = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const calendarOptions = await this.calendarReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const studentOptions = await this.studentReadCache.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId), classDivisionId: Number(classDivisionId) });

      const data = {
        calendarOptions,
        classOptions,
        classDivisionOptions,
        studentOptions,
        promotionDecisionOptions: Object.values(PromotionStatus),
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
