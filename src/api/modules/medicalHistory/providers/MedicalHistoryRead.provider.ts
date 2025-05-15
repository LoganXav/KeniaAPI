import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { MedicalHistoryCriteriaType } from "~/api/modules/medicalHistory/types/MedicalHistoryTypes";

@EnforceTenantId
export default class MedicalHistoryReadProvider {
  public async getByCriteria(criteria: MedicalHistoryCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, studentId, tenantId } = criteria;

      const medicalHistories = await dbClient.medicalHistory.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(studentId && { studentId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          student: true,
        },
      });

      return medicalHistories;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: MedicalHistoryCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, studentId, tenantId } = criteria;

      const medicalHistory = await dbClient.medicalHistory.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
          ...(studentId && { studentId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          student: true,
        },
      });

      return medicalHistory;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
