import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { MedicalHistoryUpdateRequestType } from "../types/MedicalHistoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class MedicalHistoryUpdateProvider {
  public async update(args: MedicalHistoryUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, description, studentId, tenantId } = args;

      const medicalHistory = await dbClient.medicalHistory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
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
