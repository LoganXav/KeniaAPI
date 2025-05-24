import { TenantGradingStructure } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { TenantGradingStructureCreateRequestType } from "~/api/modules/tenant/types/TenantGradingStructureTypes";

@EnforceTenantId
export default class TenantGradingStructureCreateProvider {
  public async createOrUpdate(args: TenantGradingStructureCreateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<TenantGradingStructure> {
    try {
      const { id, name, continuousAssessmentWeight, examWeight, classIds, tenantId } = args;

      const gradingStructure = await dbClient.tenantGradingStructure.upsert({
        where: { id: id || 0 },
        update: {
          name,
          continuousAssessmentWeight,
          examWeight,
          classes: {
            connect: classIds?.map((id) => ({ id: Number(id) })),
          },
          tenantId,
        },
        create: {
          name,
          continuousAssessmentWeight,
          examWeight,
          classes: {
            connect: classIds?.map((id) => ({ id: Number(id) })),
          },
          tenantId,
        },
        include: {
          classes: true,
        },
      });

      return gradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
