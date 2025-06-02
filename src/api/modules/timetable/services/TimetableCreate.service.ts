import { autoInjectable } from "tsyringe";
import { Timetable } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "../../base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import TimetableCreateProvider from "../providers/TimetableCreate.provider";
import PeriodReadProvider from "../../period/providers/PeriodRead.provider";
import { TimetableCreateOrUpdateRequestType } from "../types/TimetableTypes";
import PeriodDeleteProvider from "../../period/providers/PeriodDelete.provider";
import PeriodCreateProvider from "../../period/providers/PeriodCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, TIMETABLE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
@autoInjectable()
export default class TimetableCreateService extends BaseService<TimetableCreateOrUpdateRequestType> {
  static serviceName = "TimetableCreateService";
  loggingProvider: ILoggingDriver;
  periodReadProvider: PeriodReadProvider;
  periodDeleteProvider: PeriodDeleteProvider;
  periodCreateProvider: PeriodCreateProvider;
  timetableCreateProvider: TimetableCreateProvider;

  constructor(periodReadProvider: PeriodReadProvider, periodCreateProvider: PeriodCreateProvider, periodDeleteProvider: PeriodDeleteProvider, timetableCreateProvider: TimetableCreateProvider) {
    super(TimetableCreateService.serviceName);
    this.periodReadProvider = periodReadProvider;
    this.periodCreateProvider = periodCreateProvider;
    this.periodDeleteProvider = periodDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.timetableCreateProvider = timetableCreateProvider;
  }

  public async execute(trace: ServiceTrace, args: TimetableCreateOrUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const timetable = await this.createTimeTableWithPeriodsTransaction(args);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createTimeTableWithPeriodsTransaction(args: TimetableCreateOrUpdateRequestType): Promise<Timetable> {
    return DbClient.$transaction(async (tx) => {
      const timetable = await this.timetableCreateProvider.createOrUpdate(
        {
          id: args.id,
          day: args.day,
          classDivisionId: args.classDivisionId,
          tenantId: args.tenantId,
          termId: args.termId,
        },
        tx
      );

      const existingPeriods = await this.periodReadProvider.getByCriteria(
        {
          timetableId: timetable.id,
          tenantId: args.tenantId,
        },
        tx
      );

      const periods = await Promise.all(
        args.periods.map(async (periodData: any) => {
          return this.periodCreateProvider.createOrUpdate(
            {
              id: periodData.id,
              startTime: periodData.startTime,
              endTime: periodData.endTime,
              subjectId: periodData.subjectId,
              timetableId: timetable.id,
              isBreak: periodData.isBreak,
              breakType: periodData.breakType,
              tenantId: args.tenantId,
            },
            tx
          );
        })
      );

      // Delete periods not present in the request
      const periodIdsToKeep = args.periods.map((p: any) => p.id);
      await Promise.all(existingPeriods.filter((p: any) => !periodIdsToKeep.includes(p.id)).map((p: any) => this.periodDeleteProvider.delete({ id: p.id, tenantId: args.tenantId }, tx)));

      return { ...timetable, periods };
    });
  }
}
