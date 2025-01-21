import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Role } from "@prisma/client";
import { CreateRoleData } from "../types/RoleTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class RoleCreateProvider {
  public async createRole(data: CreateRoleData, dbClient: PrismaTransactionClient = DbClient): Promise<Role> {
    try {
      const { tenantId, name, rank, permissions } = data;

      const newRole = await dbClient?.role?.create({
        data: {
          name,
          rank,
          permissions: {
            connect: permissions.map((permissionId) => ({ id: permissionId })), // Ensure permissions are properly connected
          },
          tenantId,
        },
      });

      return newRole;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
