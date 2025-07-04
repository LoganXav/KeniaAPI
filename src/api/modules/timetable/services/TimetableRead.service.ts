import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import TimetableReadProvider from "../providers/TimetableRead.provider";
import { SUCCESS, TIMETABLE_RESOURCE, ERROR, TERM_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IRequest } from "~/infrastructure/internal/types";
import TermReadProvider from "~/api/modules/term/providers/TermRead.provider";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { BreakWeekType, TermType } from "../../schoolCalendar/types/SchoolCalendarTypes";
import { PeriodType, TimetableType } from "../types/TimetableTypes";
import DateTimeUtils from "~/utils/DateTimeUtil";

@autoInjectable()
export default class TimetableReadService extends BaseService<IRequest> {
  static serviceName = "TimetableReadService";
  timetableReadProvider: TimetableReadProvider;
  loggingProvider: ILoggingDriver;
  termReadProvider: TermReadProvider;

  constructor(timetableReadProvider: TimetableReadProvider, termReadProvider: TermReadProvider) {
    super(TimetableReadService.serviceName);
    this.timetableReadProvider = timetableReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.termReadProvider = termReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const termInfo = await this.termReadProvider.getOneByCriteria({ id: args.query.termId, tenantId: args.body.tenantId });
      if (!termInfo) throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(TERM_RESOURCE));

      const timetables = await this.timetableReadProvider.getByCriteria({ classDivisionId: Number(args.query.classDivisionId), tenantId: args.body.tenantId, termId: Number(args.query.termId), day: args.query.day });

      // Only transform timetables that belong to the requested term
      // const filteredTimetables = timetables.filter((t) => t.termId === termInfo.id);

      const timedPeriods = this.transformTimetableInTermToTimedPeriods(termInfo, timetables);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TIMETABLE_RESOURCE), timedPeriods);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.query);

      const timetable = await this.timetableReadProvider.getOneByCriteria({ day: args.query.day, classDivisionId: Number(args.query.classDivisionId), tenantId: args.body.tenantId, termId: Number(args.query.termId) });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private transformTimetableInTermToTimedPeriods(term: TermType, timetables: TimetableType[]) {
    const timedPeriods: Array<{ start: string; end: string; title?: string | null }> = [];

    timetables.forEach((timetable) => {
      const validDates = this.getWeekdayDatesBetween(new Date(term.startDate), new Date(term.endDate), timetable.day).filter((date: Date) => {
        const isBreak = this.checkIsDateInBreakWeeks(date, term.breakWeeks);
        return !isBreak;
      });

      validDates.forEach((date: Date) => {
        timetable.periods.forEach((period: PeriodType) => {
          const startTime = period.startTime.split("T")[1]; // Get the time part after 'T'
          const endTime = period.endTime.split("T")[1];

          const [startHour, startMin] = startTime.split(":");
          const [endHour, endMin] = endTime.split(":");

          // Create new dates
          const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(startHour), parseInt(startMin), 0);

          const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(endHour), parseInt(endMin), 0);

          // Format for consistent output
          const formattedStart = DateTimeUtils.format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
          const formattedEnd = DateTimeUtils.format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

          timedPeriods.push({
            start: formattedStart,
            end: formattedEnd,
            title: period.isBreak ? period.breakType : period.subject?.name || "Unassigned",
          });
        });
      });
    });

    return timedPeriods;
  }

  // Helper to check if the date is in the break weeks
  private checkIsDateInBreakWeeks(date: Date, breakWeeks: BreakWeekType[]): boolean {
    // Normalize the date to start of day for comparison
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return breakWeeks.some((breakWeek) => {
      const breakStart = new Date(breakWeek.startDate);
      const breakEnd = new Date(breakWeek.endDate);

      // Normalize break dates to start of day
      const normalizedBreakStart = new Date(breakStart.getFullYear(), breakStart.getMonth(), breakStart.getDate());
      const normalizedBreakEnd = new Date(breakEnd.getFullYear(), breakEnd.getMonth(), breakEnd.getDate());

      const isInBreak = normalizedDate >= normalizedBreakStart && normalizedDate <= normalizedBreakEnd;

      return isInBreak;
    });
  }

  // Helper to get all dates for a specific weekday between start and end dates of the term
  private getWeekdayDatesBetween(start: Date, end: Date, weekday: string) {
    const weekdayMap: Record<string, number> = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
    };

    const dates = DateTimeUtils.eachDayOfInterval(start, end)
      .filter((date: Date) => !DateTimeUtils.isWeekend(date))
      .filter((date: Date) => date.getDay() === weekdayMap[weekday]);

    return dates;
  }
}
