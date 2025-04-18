import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BreakPeriodCreateRequestType } from "../types/BreakPeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class BreakPeriodCreateProvider {
  public async createOrUpdate(args: BreakPeriodCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, startDate, endDate, termId, tenantId } = args;

      const breakPeriod = await dbClient.breakPeriod.upsert({
        where: { id: id || 0 },
        update: {
          name,
          startDate,
          endDate,
          termId,
          tenantId,
        },
        create: {
          name,
          startDate,
          endDate,
          termId,
          tenantId,
        },
      });
      return breakPeriod;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
