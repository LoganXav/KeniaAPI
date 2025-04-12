import { autoInjectable } from "tsyringe";
import DbClient from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import TermReadProvider from "../../term/providers/TermRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import TermCreateProvider from "../../term/providers/TermCreate.provider";
import TermDeleteProvider from "../../term/providers/TermDelete.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import SchoolCalendarReadProvider from "../providers/SchoolCalendarRead.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import SchoolCalendarCreateProvider from "../providers/SchoolCalendarCreate.provider";
import BreakPeriodCreateProvider from "../../breakPeriod/providers/BreakPeriodCreate.provider";
import BreakPeriodDeleteProvider from "../../breakPeriod/providers/BreakPeriodDelete.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, SCHOOL_CALENDAR_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SchoolCalendarCreateRequestType, TotalSchoolCalendarCreateRequestType } from "../types/SchoolCalendarTypes";
import { Term, BreakPeriod } from "@prisma/client";

@autoInjectable()
export default class SchoolCalendarCreateService extends BaseService<SchoolCalendarCreateRequestType> {
  static serviceName = "SchoolCalendarCreateService";
  loggingProvider: ILoggingDriver;
  termReadProvider: TermReadProvider;
  termDeleteProvider: TermDeleteProvider;
  termCreateProvider: TermCreateProvider;
  breakPeriodCreateProvider: BreakPeriodCreateProvider;
  breakPeriodDeleteProvider: BreakPeriodDeleteProvider;
  schoolCalendarReadProvider: SchoolCalendarReadProvider;
  schoolCalendarCreateProvider: SchoolCalendarCreateProvider;

  constructor(
    termReadProvider: TermReadProvider,
    termDeleteProvider: TermDeleteProvider,
    termCreateProvider: TermCreateProvider,
    breakPeriodDeleteProvider: BreakPeriodDeleteProvider,
    breakPeriodCreateProvider: BreakPeriodCreateProvider,
    schoolCalendarReadProvider: SchoolCalendarReadProvider,
    schoolCalendarCreateProvider: SchoolCalendarCreateProvider
  ) {
    super(SchoolCalendarCreateService.serviceName);
    this.termReadProvider = termReadProvider;
    this.termCreateProvider = termCreateProvider;
    this.termDeleteProvider = termDeleteProvider;
    this.breakPeriodCreateProvider = breakPeriodCreateProvider;
    this.breakPeriodDeleteProvider = breakPeriodDeleteProvider;
    this.schoolCalendarReadProvider = schoolCalendarReadProvider;
    this.schoolCalendarCreateProvider = schoolCalendarCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: TotalSchoolCalendarCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const schoolCalendar = await this.schoolCalendarCreateTransaction(args);

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

  private async schoolCalendarCreateTransaction(args: TotalSchoolCalendarCreateRequestType) {
    return DbClient.$transaction(async (tx) => {
      const schoolCalendar = await this.schoolCalendarCreateProvider.createOrUpdate(
        {
          id: args.id,
          year: args.year,
          tenantId: args.tenantId,
        },
        tx
      );

      const existingTerms = await this.termReadProvider.getByCriteria({ calendarId: schoolCalendar.id, tenantId: args.tenantId }, tx);

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
          .filter((t: Term) => !termIdsToKeep.includes(t.id))
          .map(async (t: any) => {
            await Promise.all(t.breakWeeks.map((bw: BreakPeriod) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
            return this.termDeleteProvider.delete({ id: t.id, tenantId: args.tenantId }, tx);
          })
      );

      // Delete break periods not present in the request for existing and passed terms
      await Promise.all(
        existingTerms.map(async (existingTerm: any) => {
          const passedTerm = args.terms.find((t: any) => t.id === existingTerm.id);
          if (passedTerm) {
            const breakPeriodIdsToKeep = passedTerm.breakWeeks.map((bw: any) => bw.id);
            await Promise.all(existingTerm.breakWeeks.filter((bw: BreakPeriod) => !breakPeriodIdsToKeep.includes(bw.id)).map((bw: BreakPeriod) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
          }
        })
      );

      return { ...schoolCalendar, terms };
    });
  }
}
