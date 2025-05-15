import { Permission } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { PermissionReadCriteria } from "~/api/modules/permission/types/PermissionTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class PermissionReadProvider {
  public async getByCriteria(criteria: PermissionReadCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Permission[]> {
    try {
      const { tenantId } = criteria;

      const permissions = await dbClient?.permission?.findMany({
        where: {
          ...(tenantId && { tenantId }),
        },
      });

      return permissions;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
