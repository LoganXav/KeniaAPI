import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { MedicalHistoryDeleteRequestType } from "../types/MedicalHistoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
