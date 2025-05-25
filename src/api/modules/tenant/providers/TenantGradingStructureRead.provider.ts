import { GradeBoundary, TenantGradingStructure } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { TenantGradingStructureCriteria } from "~/api/modules/tenant/types/TenantGradingStructureTypes";

@EnforceTenantId
export default class TenantGradingStructureReadProvider {
  public async getOneByCriteria(args: TenantGradingStructureCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<(TenantGradingStructure & { gradeBoundaries: GradeBoundary[] }) | null> {
    try {
      const { id, classId, tenantId } = args;
      const gradingStructure = await dbClient.tenantGradingStructure.findFirst({
        where: {
          ...(id && { id: Number(id) }),
          ...(tenantId && { tenantId }),
          ...(classId && {
            classes: {
              some: {
                id: classId,
              },
            },
          }),
        },
        include: {
          gradeBoundaries: true,
        },
      });

      return gradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
