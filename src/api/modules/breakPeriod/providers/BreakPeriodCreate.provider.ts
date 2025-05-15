import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { BreakPeriodCreateRequestType } from "~/api/modules/breakPeriod/types/BreakPeriodTypes";

@EnforceTenantId
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
