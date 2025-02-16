import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryDeleteRequestType } from "../types/DormitoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DormitoryDeleteProvider {
  public async delete(args: DormitoryDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const dormitory = await dbClient.dormitory.delete({
        where: {
          id,
          tenantId,
        },
        include: {
          students: true,
        },
      });

      return dormitory;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
