import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { PermissionCreateRequestType } from "~/api/modules/permission/types/PermissionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class PermissionCreateProvider {
  public async create(data: PermissionCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const permission = await dbClient.permission.create({
        data: {
          name: data.name,
          tenantId: data.tenantId,
        },
      });

      return permission;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async createMany(args: PermissionCreateRequestType[], dbClient: PrismaTransactionClient = DbClient) {
    try {
      const data = args.map(({ name, tenantId }) => ({
        name,
        tenantId,
      }));

      await dbClient.permission.createMany({
        data,
      });
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
