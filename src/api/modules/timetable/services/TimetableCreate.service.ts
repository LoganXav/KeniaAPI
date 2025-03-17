import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { TimetableCreateOrUpdateRequestType } from "../types/TimetableTypes";
import TimetableCreateProvider from "../providers/TimetableCreate.provider";
import { SUCCESS, TIMETABLE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IRequest } from "~/infrastructure/internal/types";
import PeriodCreateProvider from "../../period/providers/PeriodCreate.provider";
import PeriodDeleteProvider from "../../period/providers/PeriodDelete.provider";
import DbClient from "~/infrastructure/internal/database";

@autoInjectable()
export default class TimetableCreateService extends BaseService<IRequest> {
  static serviceName = "TimetableCreateService";
  timetableCreateProvider: TimetableCreateProvider;
  loggingProvider: ILoggingDriver;
  periodCreateProvider: PeriodCreateProvider;
  periodDeleteProvider: PeriodDeleteProvider;

  constructor(timetableCreateProvider: TimetableCreateProvider, periodCreateProvider: PeriodCreateProvider, periodDeleteProvider: PeriodDeleteProvider) {
    super(TimetableCreateService.serviceName);
    this.timetableCreateProvider = timetableCreateProvider;
    this.periodCreateProvider = periodCreateProvider;
    this.periodDeleteProvider = periodDeleteProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const timetable = await this.timetableCreateProvider.create(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async createOrUpdate(trace: ServiceTrace, args: TimetableCreateOrUpdateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const timetable = await DbClient.$transaction(async (tx) => {
        const timetable = await this.timetableCreateProvider.createOrUpdate(
          {
            id: args.id,
            day: args.day,
            classDivisionId: args.classDivisionId,
            tenantId: args.tenantId,
          },
          tx
        );

        const existingPeriods = await tx.period.findMany({
          where: { timetableId: timetable.id, tenantId: args.tenantId },
        });

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

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(TIMETABLE_RESOURCE), timetable);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
