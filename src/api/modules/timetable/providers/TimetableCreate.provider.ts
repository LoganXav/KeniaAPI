import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableCreateRequestType } from "../types/TimetableTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TimetableCreateProvider {
  public async createOrUpdate(args: TimetableCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, day, classDivisionId, tenantId, termId } = args;

      const timetable = await dbClient.timetable.upsert({
        where: { id: id || 0 },
        update: {
          day,
          classDivisionId,
          tenantId,
          termId,
        },
        create: {
          day,
          classDivisionId,
          tenantId,
          termId,
        },
      });
      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
