import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableCreateRequestType } from "../types/TimetableTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TimetableCreateProvider {
  public async create(args: TimetableCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { day, classDivisionId, tenantId } = args;

      const timetable = await dbClient.timetable.create({
        data: {
          day,
          classDivisionId,
          tenantId,
        },
        include: {
          periods: true,
        },
      });
      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async createOrUpdate(args: TimetableCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, day, classDivisionId, tenantId } = args;

      const timetable = await dbClient.timetable.upsert({
        where: { id: id || 0 },
        update: {
          day,
          classDivisionId,
          tenantId,
        },
        create: {
          day,
          classDivisionId,
          tenantId,
        },
      });
      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
