import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { PeriodCreateRequestType } from "../types/PeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class PeriodCreateProvider {
  public async create(args: PeriodCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { startTime, endTime, subjectId, timetableId, isBreak, breakType, tenantId } = args;

      const period = await dbClient.period.create({
        data: {
          startTime,
          endTime,
          subjectId,
          timetableId,
          isBreak,
          breakType,
          tenantId,
        },
        include: {
          subject: true,
        },
      });
      return period;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async createOrUpdate(args: PeriodCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, startTime, endTime, subjectId, timetableId, isBreak, breakType, tenantId } = args;

      const period = await dbClient.period.upsert({
        where: { id: id || 0 },
        update: {
          startTime,
          endTime,
          subjectId,
          timetableId,
          isBreak,
          breakType,
          tenantId,
        },
        create: {
          startTime,
          endTime,
          subjectId,
          timetableId,
          isBreak,
          breakType,
          tenantId,
        },
      });
      return period;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
