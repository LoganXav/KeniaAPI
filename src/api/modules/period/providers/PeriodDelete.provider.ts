import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { PeriodDeleteRequestType } from "../types/PeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class PeriodDeleteProvider {
  public async delete(args: PeriodDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const period = await dbClient.period.delete({
        where: {
          id,
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
}
