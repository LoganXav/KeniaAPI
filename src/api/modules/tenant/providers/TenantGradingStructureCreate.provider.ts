import { TenantGradingStructure } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { TenantGradingStructureCreateRequestType } from "~/api/modules/tenant/types/TenantGradingStructureTypes";

@EnforceTenantId
export default class TenantGradingStructureCreateProvider {
  public async createOrUpdate(args: TenantGradingStructureCreateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<TenantGradingStructure> {
    try {
      const { id, name, continuousAssessmentWeight, examWeight, classIds, tenantId, gradeBoundaries } = args;

      const gradingStructure = await dbClient.tenantGradingStructure.upsert({
        where: { id: id || 0 },
        update: {
          name,
          continuousAssessmentWeight,
          examWeight,
          classes: {
            set: classIds?.map((id) => ({ id: Number(id) })),
          },
          tenantId,
          gradeBoundaries: {
            create: gradeBoundaries.map((b) => ({
              minimumScore: b.minimumScore,
              maximumScore: b.maximumScore,
              grade: b.grade,
              remark: b.remark,
            })),
          },
        },
        create: {
          name,
          continuousAssessmentWeight,
          examWeight,
          classes: {
            connect: classIds?.map((id) => ({ id: Number(id) })),
          },
          tenantId,
          gradeBoundaries: {
            create: gradeBoundaries.map((b) => ({
              minimumScore: b.minimumScore,
              maximumScore: b.maximumScore,
              grade: b.grade,
              remark: b.remark,
            })),
          },
        },
        include: {
          classes: true,
          gradeBoundaries: true,
        },
      });

      return gradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
