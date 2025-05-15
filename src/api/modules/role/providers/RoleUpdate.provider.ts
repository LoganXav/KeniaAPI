import { Role } from "@prisma/client";
import { RoleUpdateData } from "~/api/modules/role/types/RoleTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class RoleUpdateProvider {
  public async updateOne(data: RoleUpdateData, dbClient: PrismaTransactionClient = DbClient): Promise<Role> {
    try {
      const { id, tenantId, permissions } = data;

      const updatedRole = await dbClient?.role?.update({
        where: {
          id,
        },
        data: {
          ...(tenantId && { tenantId }),
          ...(permissions && { permissions: { connect: permissions.map((p) => ({ id: p.id })) } }),
        },
      });

      return updatedRole;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
