import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentReadCache from "~/api/modules/student/cache/StudentRead.cache";
import TermReadProvider from "~/api/modules/term/providers/TermRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, ERROR, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassDivisionReadProvider from "~/api/modules/classDivision/providers/ClassDivisionRead.provider";
import SchoolCalendarReadProvider from "~/api/modules/schoolCalendar/providers/SchoolCalendarRead.provider";

@autoInjectable()
export default class SubjectGradingTemplateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingTemplateService";
  classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  termReadProvider: TermReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;
  schoolCalendarReadProvider: SchoolCalendarReadProvider;

  constructor(schoolCalendarReadProvider: SchoolCalendarReadProvider, termReadProvider: TermReadProvider, classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, studentReadCache: StudentReadCache) {
    super(SubjectGradingTemplateService.serviceName);
    this.classReadCache = classReadCache;
    this.termReadProvider = termReadProvider;
    this.studentReadCache = studentReadCache;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.schoolCalendarReadProvider = schoolCalendarReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;
      const { calendarId, classId, subjectId } = args.query;

      const schoolCalendars = await this.schoolCalendarReadProvider.getByCriteria({ tenantId });
      const terms = await this.termReadProvider.getByCriteria({ calendarId: Number(calendarId), tenantId });

      const classes = await this.classReadCache.getByCriteria({ tenantId });
      const classDivision = await this.classDivisionReadProvider.getByCriteria({
        tenantId,
        classId: Number(classId),
      });

      const students = await this.studentReadCache.getByCriteria({ tenantId, classId: Number(classId), calendarId: Number(calendarId) });

      const studentsOfferingSubject = students?.filter((student) => student.subjectsRegistered?.some((registration) => registration.subject?.id === Number(subjectId)));

      const template = {
        calendarOptions: schoolCalendars,
        termOptions: terms,
        classOptions: classes,
        classDivisionOptions: classDivision,
        studentOptions: studentsOfferingSubject,
      };

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_FETCHED_SUCCESSFULLY(TEMPLATE_RESOURCE), template);
      return this.result;
    } catch (error: any) {
      console.log(error);

      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
