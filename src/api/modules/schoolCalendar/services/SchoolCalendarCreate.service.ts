import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { SchoolCalendarCreateRequestType, TotalSchoolCalendarCreateRequestType } from "../types/SchoolCalendarTypes";
import SchoolCalendarCreateProvider from "../providers/SchoolCalendarCreate.provider";
import TermCreateProvider from "../../term/providers/TermCreate.provider";
import BreakPeriodCreateProvider from "../../breakPeriod/providers/BreakPeriodCreate.provider";
import BreakPeriodDeleteProvider from "../../breakPeriod/providers/BreakPeriodDelete.provider";
import TermDeleteProvider from "../../term/providers/TermDelete.provider";
import SchoolCalendarReadProvider from "../providers/SchoolCalendarRead.provider";
import { SUCCESS, SCHOOL_CALENDAR_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import DbClient from "~/infrastructure/internal/database";

@autoInjectable()
export default class SchoolCalendarCreateService extends BaseService<SchoolCalendarCreateRequestType> {
  static serviceName = "SchoolCalendarCreateService";
  schoolCalendarCreateProvider: SchoolCalendarCreateProvider;
  termCreateProvider: TermCreateProvider;
  breakPeriodCreateProvider: BreakPeriodCreateProvider;
  loggingProvider: ILoggingDriver;
  schoolCalendarReadProvider: SchoolCalendarReadProvider;
  breakPeriodDeleteProvider: BreakPeriodDeleteProvider;
  termDeleteProvider: TermDeleteProvider;

  constructor(
    schoolCalendarCreateProvider: SchoolCalendarCreateProvider,
    termCreateProvider: TermCreateProvider,
    breakPeriodCreateProvider: BreakPeriodCreateProvider,
    schoolCalendarReadProvider: SchoolCalendarReadProvider,
    breakPeriodDeleteProvider: BreakPeriodDeleteProvider,
    termDeleteProvider: TermDeleteProvider
  ) {
    super(SchoolCalendarCreateService.serviceName);
    this.schoolCalendarCreateProvider = schoolCalendarCreateProvider;
    this.termCreateProvider = termCreateProvider;
    this.breakPeriodCreateProvider = breakPeriodCreateProvider;
    this.schoolCalendarReadProvider = schoolCalendarReadProvider;
    this.breakPeriodDeleteProvider = breakPeriodDeleteProvider;
    this.termDeleteProvider = termDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: TotalSchoolCalendarCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const schoolCalendar = await DbClient.$transaction(async (tx) => {
        const schoolCalendar = await this.schoolCalendarCreateProvider.createOrUpdate(
          {
            id: args.id,
            year: args.year,
            tenantId: args.tenantId,
          },
          tx
        );

        const existingTerms = await tx.term.findMany({
          where: { calendarId: schoolCalendar.id, tenantId: args.tenantId },
          include: { breakWeeks: true },
        });

        const terms = await Promise.all(
          args.terms.map(async (termData) => {
            const term = await this.termCreateProvider.createOrUpdate(
              {
                id: termData.id,
                name: termData.name,
                startDate: termData.startDate,
                endDate: termData.endDate,
                calendarId: schoolCalendar.id,
                tenantId: args.tenantId,
              },
              tx
            );

            const breakWeeks = await Promise.all(
              termData.breakWeeks.map(async (breakData) => {
                return this.breakPeriodCreateProvider.createOrUpdate(
                  {
                    id: breakData.id,
                    name: breakData.name,
                    startDate: breakData.startDate,
                    endDate: breakData.endDate,
                    termId: term.id,
                    tenantId: args.tenantId,
                  },
                  tx
                );
              })
            );

            return { ...term, breakWeeks };
          })
        );

        // Delete terms not present in the request
        const termIdsToKeep = args.terms.map((t) => t.id);
        await Promise.all(
          existingTerms
            .filter((t) => !termIdsToKeep.includes(t.id))
            .map(async (t) => {
              await Promise.all(t.breakWeeks.map((bw) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
              return this.termDeleteProvider.delete({ id: t.id, tenantId: args.tenantId }, tx);
            })
        );

        // Delete break periods not present in the request for existing and passed terms
        await Promise.all(
          existingTerms.map(async (existingTerm) => {
            const passedTerm = args.terms.find((t) => t.id === existingTerm.id);
            if (passedTerm) {
              const breakPeriodIdsToKeep = passedTerm.breakWeeks.map((bw) => bw.id);
              await Promise.all(existingTerm.breakWeeks.filter((bw) => !breakPeriodIdsToKeep.includes(bw.id)).map((bw) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
            }
          })
        );

        return { ...schoolCalendar, terms };
      });

      const result = await this.schoolCalendarReadProvider.getOneByCriteria({ id: schoolCalendar.id });

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SCHOOL_CALENDAR_RESOURCE), result);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
