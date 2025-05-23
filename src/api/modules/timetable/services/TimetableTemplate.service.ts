import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import ClassReadCache from "../../class/cache/ClassRead.cache";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";
import { Weekday, BreakType, Term } from "@prisma/client";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { TermType } from "../../schoolCalendar/types/SchoolCalendarTypes";
@autoInjectable()
export default class TimetableTemplateService extends BaseService<IRequest> {
  static serviceName = "TimetableTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  classDivisionReadProvider: ClassDivisionReadProvider;
  subjectReadProvider: SubjectReadProvider;
  termReadProvider: TermReadProvider;

  constructor(classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, subjectReadProvider: SubjectReadProvider, termReadProvider: TermReadProvider) {
    super(TimetableTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.classReadCache = classReadCache;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.subjectReadProvider = subjectReadProvider;
    this.termReadProvider = termReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { classId } = args.query;

      const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivision = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });
      const terms = await this.termReadProvider.getByCriteria({ tenantId: args.body.tenantId });

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
