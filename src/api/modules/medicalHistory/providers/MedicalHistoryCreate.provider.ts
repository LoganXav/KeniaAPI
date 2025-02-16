import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { MedicalHistoryCreateRequestType } from "../types/MedicalHistoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
