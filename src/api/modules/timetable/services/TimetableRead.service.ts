import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { TimetableCriteriaType, TimetableReadOneRequestType } from "../types/TimetableTypes";
import TimetableReadProvider from "../providers/TimetableRead.provider";
import { SUCCESS, TIMETABLE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IRequest } from "~/infrastructure/internal/types";
import TermReadProvider from "~/api/modules/term/providers/TermRead.provider";
import { isWithinInterval, eachDayOfInterval, isWeekend } from "date-fns";

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
      this.initializeServiceTrace(trace, args);

      const timetables = await this.timetableReadProvider.getByCriteria(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetables);
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

      const timetable = await this.timetableReadProvider.getOneByCriteria({ ...args.query, tenantId: args.body.tenantId });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readFullTimetable(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      // 1. Fetch Term with BreakPeriods
      const termInfo = await this.termReadProvider.getOneByCriteria({ id: args.body.termId, tenantId: args.body.tenantId });
      if (!termInfo) throw new Error("Term not found");

      // 2. Fetch BreakPeriod Intervals
      const breakIntervals = termInfo.breakWeeks.map((b) => ({
        start: new Date(b.startDate),
        end: new Date(b.endDate),
      }));

      // 3. Generate valid school days
      const allDays = eachDayOfInterval({
        start: new Date(termInfo.startDate),
        end: new Date(termInfo.endDate),
      });

      const validDays = allDays.filter((day) => {
        if (isWeekend(day)) return false;
        const isInBreak = breakIntervals.some((b) => isWithinInterval(day, { start: b.start, end: b.end }));
        return !isInBreak;
      });

      // 4. Fetch Timetables for classDivisionId
      const timetables = await this.timetableReadProvider.getByCriteria({ classDivisionId: args.body.classDivisionId, tenantId: args.body.tenantId });

      // 5. Map valid days to timetable based on weekday
      const enrichedDays = validDays
        .map((date) => {
          const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
          const timetable = timetables.find((t) => t.day === weekday);

          if (!timetable) return null;

          return {
            date,
            weekday,
            timetable: {
              id: timetable.id,
              periods: timetable.periods.map((p) => ({
                ...p,
                date,
              })),
            },
          };
        })
        .filter(Boolean);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TIMETABLE_RESOURCE), enrichedDays);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
