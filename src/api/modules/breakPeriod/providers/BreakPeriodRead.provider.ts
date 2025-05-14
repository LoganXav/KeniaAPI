import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BreakPeriodCriteriaType } from "../types/BreakPeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class BreakPeriodReadProvider {
  public async getByCriteria(criteria: BreakPeriodCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, termId, tenantId } = criteria;

      const breakPeriods = await dbClient.breakPeriod.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(termId && { termId }),
          ...(tenantId && { tenantId }),
        },
      });

      return breakPeriods;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: BreakPeriodCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, termId, tenantId } = criteria;

      const breakPeriod = await dbClient.breakPeriod.findFirst({
        where: {
          ...(id && { id }),
          ...(termId && { termId }),
          ...(tenantId && { tenantId }),
        },
      });

      return breakPeriod;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
