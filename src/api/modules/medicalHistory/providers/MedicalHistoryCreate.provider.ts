import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { MedicalHistoryCreateRequestType } from "~/api/modules/medicalHistory/types/MedicalHistoryTypes";

@EnforceTenantId
export default class MedicalHistoryCreateProvider {
  public async create(args: MedicalHistoryCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, description, studentId, tenantId } = args;

      const medicalHistory = await dbClient.medicalHistory.create({
        data: {
          name,
          description,
          studentId,
          tenantId,
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
