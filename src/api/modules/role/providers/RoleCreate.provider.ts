import { Role } from "@prisma/client";
import { RoleCreateData } from "~/api/modules/role/types/RoleTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class RoleCreateProvider {
  public async createRole(data: RoleCreateData, dbClient: PrismaTransactionClient = DbClient): Promise<Role> {
    try {
      const { tenantId, name, permissionIds, staffIds, scope, description, isAdmin } = data;

      const newRole = await dbClient?.role?.create({
        data: {
          name,
          tenantId,
          // scope,
          isAdmin,
          description,
          staff: {
            connect: staffIds?.map((id) => ({ id })),
          },
          permissions: {
            connect: permissionIds?.map((id) => ({ id })),
          },
        },
        include: {
          permissions: true,
        },
      });

      return newRole;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
