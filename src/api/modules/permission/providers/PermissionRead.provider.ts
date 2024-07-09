import DbClient from "~/infrastructure/internal/database";
import { Permission } from "@prisma/client";
import { PermissionCriteria } from "../types/PermissionTypes";

export default class PermissionReadProvider {
  public async getAllPermission(tx?: any): Promise<Permission[]> {
    const dbClient = tx ? tx : DbClient;
    const permissions = await dbClient?.permission?.findMany();

    return permissions;
  }

  public async getByCriteria(criteria: PermissionCriteria, tx?: any): Promise<Permission[]> {
    const dbClient = tx ? tx : DbClient;
    const permissions = await dbClient?.permission?.findMany({
      where: criteria,
    });

    return permissions;
  }

  public async getOneByCriteria(criteria: PermissionCriteria, tx?: any): Promise<Permission> {
    const dbClient = tx ? tx : DbClient;
    const permission = await dbClient?.permission?.findFirst({
      where: criteria,
    });

    return permission;
  }
}
