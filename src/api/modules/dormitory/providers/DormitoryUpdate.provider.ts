import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryUpdateRequestType } from "~/api/modules/dormitory/types/DormitoryTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
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
