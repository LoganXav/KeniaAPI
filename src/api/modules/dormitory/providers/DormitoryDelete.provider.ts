import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryDeleteRequestType } from "~/api/modules/dormitory/types/DormitoryTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
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
