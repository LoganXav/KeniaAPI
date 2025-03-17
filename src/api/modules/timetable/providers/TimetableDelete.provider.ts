import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableDeleteRequestType } from "../types/TimetableTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TimetableDeleteProvider {
  public async delete(args: TimetableDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const timetable = await dbClient.timetable.delete({
        where: {
          id,
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
}
