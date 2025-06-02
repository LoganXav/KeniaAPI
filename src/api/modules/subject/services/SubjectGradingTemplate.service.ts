import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import ClassReadCache from "../../class/cache/ClassRead.cache";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, ERROR, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import SchoolCalendarReadProvider from "../../schoolCalendar/providers/SchoolCalendarRead.provider";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SubjectGradingTemplateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingTemplateService";
  classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;
  termReadProvider: TermReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;
  schoolCalendarReadProvider: SchoolCalendarReadProvider;

  constructor(schoolCalendarReadProvider: SchoolCalendarReadProvider, termReadProvider: TermReadProvider, classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider) {
    super(SubjectGradingTemplateService.serviceName);
    this.classReadCache = classReadCache;
    this.termReadProvider = termReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.schoolCalendarReadProvider = schoolCalendarReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;
      const { calendarId, classId } = args.query;

      const schoolCalendars = await this.schoolCalendarReadProvider.getByCriteria({ tenantId });
      const terms = await this.termReadProvider.getByCriteria({ calendarId: Number(calendarId), tenantId });

      const classes = await this.classReadCache.getByCriteria({ tenantId });
      const classDivision = await this.classDivisionReadProvider.getByCriteria({
        tenantId,
        classId: Number(classId),
      });

      const template = {
        calendarOptions: schoolCalendars,
        termOptions: terms,
        classOptions: classes,
        classDivisionOptions: classDivision,
      };

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_FETCHED_SUCCESSFULLY(TEMPLATE_RESOURCE), template);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
