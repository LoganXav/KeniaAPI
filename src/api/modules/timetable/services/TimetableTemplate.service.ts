import { autoInjectable } from "tsyringe";
import { Weekday, BreakType, Term } from "@prisma/client";
import { IRequest } from "~/infrastructure/internal/types";
import ClassReadCache from "../../class/cache/ClassRead.cache";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { TermType } from "../../schoolCalendar/types/SchoolCalendarTypes";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import SchoolCalendarReadProvider from "../../schoolCalendar/providers/SchoolCalendarRead.provider";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class TimetableTemplateService extends BaseService<IRequest> {
  static serviceName = "TimetableTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  termReadProvider: TermReadProvider;
  subjectReadProvider: SubjectReadProvider;
  calendarReadProvider: SchoolCalendarReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;

  constructor(classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, subjectReadProvider: SubjectReadProvider, termReadProvider: TermReadProvider, calendarReadProvider: SchoolCalendarReadProvider) {
    super(TimetableTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.classReadCache = classReadCache;
    this.termReadProvider = termReadProvider;
    this.subjectReadProvider = subjectReadProvider;
    this.calendarReadProvider = calendarReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { classId, calendarId } = args.query;

      const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivision = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const calendarOptions = await this.calendarReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });
      const terms = await this.termReadProvider.getByCriteria({ tenantId: args.body.tenantId, calendarId: Number(calendarId) });

      const termOptions = terms.map((term: TermType) => ({
        name: term.name,
        id: term.id,
        startDate: term.startDate,
        endDate: term.endDate,
        tenantId: term.tenantId,
      }));

      const data = {
        classOptions: classes,
        classDivisionOptions: classDivision,
        subjectOptions: subjects,
        dayOptions: Object.values(Weekday),
        breakTypeOptions: Object.values(BreakType),
        termOptions,
        calendarOptions,
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
