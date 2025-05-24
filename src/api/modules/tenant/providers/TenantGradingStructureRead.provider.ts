import { TenantGradingStructure } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TenantGradingStructureReadProvider {
  public async getOneByCriteria(args: { tenantGradingStructureId: number; tenantId: number }, dbClient: PrismaTransactionClient = DbClient): Promise<TenantGradingStructure | null> {
    try {
      const { tenantGradingStructureId, tenantId } = args;
      const gradingStructure = await dbClient.tenantGradingStructure.findFirst({
        where: { id: Number(tenantGradingStructureId), tenantId },
      });

      return gradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
