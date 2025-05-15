import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DormitoryCreateRequestType } from "~/api/modules/dormitory/types/DormitoryTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
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
