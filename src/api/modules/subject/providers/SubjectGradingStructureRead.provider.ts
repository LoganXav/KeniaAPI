import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SubjectGradingStructureCriteriaType } from "~/api/modules/subject/types/SubjectGradingStructureTypes";

@EnforceTenantId
export default class SubjectGradingStructureReadProvider {
  public async getByCriteria(criteria: SubjectGradingStructureCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, subjectId, tenantId, staffId, tenantGradingStructureId } = criteria;

      const subjectGradingStructures = await dbClient.subjectGradingStructure.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(subjectId && { subjectId }),
          ...(tenantId && { tenantId }),
          ...(staffId && { staffId }),
          ...(tenantGradingStructureId && { tenantGradingStructureId }),
        },
        include: {
          subject: true,
          staff: true,
          tenantGradingStructure: true,
          continuousAssessmentBreakdownItems: true,
        },
      });

      return subjectGradingStructures;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async getOneByCriteria(criteria: SubjectGradingStructureCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, subjectId, tenantId, staffId, tenantGradingStructureId } = criteria;

      const subjectGradingStructure = await dbClient.subjectGradingStructure.findFirst({
        where: {
          ...(id && { id }),
          ...(subjectId && { subjectId }),
          ...(tenantId && { tenantId }),
          ...(staffId && { staffId }),
          ...(tenantGradingStructureId && { tenantGradingStructureId }),
        },
        include: {
          subject: true,
          staff: true,
          tenantGradingStructure: true,
          continuousAssessmentBreakdownItems: true,
        },
      });

      return subjectGradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
