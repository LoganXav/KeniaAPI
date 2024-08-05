import DbClient from "~/infrastructure/internal/database";
import { Permission } from "@prisma/client";
import { PermissionCriteria, UpdatePermissionData } from "../types/PermissionTypes";

export default class PermissionUpdateProvider {
  public async updateOne(criteria: PermissionCriteria, updateData: UpdatePermissionData, tx?: any): Promise<Permission> {
    const dbClient = tx ? tx : DbClient;
    const updatedPermission = await dbClient?.permission?.update({
      where: criteria,
      data: updateData,
    });

    return updatedPermission as Promise<Permission>;
  }

  public async updateMany(criteria: PermissionCriteria, updateData: UpdatePermissionData, tx?: any): Promise<Permission[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedPermissions = await dbClient?.permission?.updateMany({
      where: criteria,
      data: updateData,
    });

    return updatedPermissions as Promise<Permission[]>;
  }
}
