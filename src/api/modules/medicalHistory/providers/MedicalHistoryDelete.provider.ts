import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { MedicalHistoryDeleteRequestType } from "~/api/modules/medicalHistory/types/MedicalHistoryTypes";

@EnforceTenantId
export default class MedicalHistoryDeleteProvider {
  public async delete(args: MedicalHistoryDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const medicalHistory = await dbClient.medicalHistory.delete({
        where: {
          id,
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
