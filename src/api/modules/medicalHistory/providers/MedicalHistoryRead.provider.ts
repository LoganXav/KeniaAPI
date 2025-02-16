import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { MedicalHistoryCriteriaType } from "../types/MedicalHistoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
