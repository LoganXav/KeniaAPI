import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryCreateRequestType } from "../types/DormitoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DormitoryCreateProvider {
  public async create(args: DormitoryCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, tenantId } = args;

      const dormitory = await dbClient.dormitory.create({
        data: {
          name,
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
