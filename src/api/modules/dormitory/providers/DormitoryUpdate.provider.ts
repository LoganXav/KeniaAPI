import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryUpdateRequestType } from "../types/DormitoryTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DormitoryUpdateProvider {
  public async update(args: DormitoryUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = args;

      const dormitory = await dbClient.dormitory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(tenantId && { tenantId }),
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
