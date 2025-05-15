import { Role } from "@prisma/client";
import { RoleCreateData } from "~/api/modules/role/types/RoleTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class RoleCreateProvider {
  public async createRole(data: RoleCreateData, dbClient: PrismaTransactionClient = DbClient): Promise<Role> {
    try {
      const { tenantId, name, permissionIds } = data;

      const newRole = await dbClient?.role?.create({
        data: {
          name,
          tenantId,
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
