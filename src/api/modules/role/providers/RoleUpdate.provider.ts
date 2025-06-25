import { Role } from "@prisma/client";
import { RoleUpdateData } from "~/api/modules/role/types/RoleTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class RoleUpdateProvider {
  public async updateOne(data: RoleUpdateData, dbClient: PrismaTransactionClient = DbClient): Promise<Role> {
    try {
      const { id, name, tenantId, permissionIds, description, scope, staffIds } = data;

      const updatedRole = await dbClient?.role?.update({
        where: {
          id,
        },
        data: {
          ...(name && { name }),
          ...(tenantId && { tenantId }),
          ...(description && { description }),
          // ...(scope && { scope }),
          ...(staffIds && {
            staff: {
              connect: staffIds?.map((id) => ({ id })),
            },
          }),
          ...(permissionIds && {
            permissions: {
              set: permissionIds?.map((id) => ({ id })),
            },
          }),
        },
      });

      return updatedRole;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
