import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BreakPeriodDeleteRequestType } from "../types/BreakPeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

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
