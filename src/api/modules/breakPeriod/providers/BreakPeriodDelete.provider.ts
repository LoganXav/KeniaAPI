import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { BreakPeriodDeleteRequestType } from "~/api/modules/breakPeriod/types/BreakPeriodTypes";

@EnforceTenantId
export default class BreakPeriodDeleteProvider {
  public async delete(args: BreakPeriodDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const breakPeriod = await dbClient.breakPeriod.delete({
        where: {
          id,
          tenantId,
        },
      });

      return breakPeriod;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
