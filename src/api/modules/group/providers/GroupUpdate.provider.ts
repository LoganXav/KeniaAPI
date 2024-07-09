import DbClient from "~/infrastructure/internal/database";
import { Role } from "@prisma/client";
import { RoleCriteria, UpdateRoleData } from "../types/RoleTypes";

export default class RoleUpdateProvider {
  public async updateOne(criteria: RoleCriteria, updateData: UpdateRoleData, tx?: any) : Promise<Role> {
    const dbClient = tx ? tx : DbClient;
    const updatedRole = await dbClient?.role?.update({
            where: criteria,
            data: updateData,
          });

    return updatedRole as Promise<Role>;
  }

  public async updateMany(criteria: RoleCriteria, updateData: UpdateRoleData, tx?: any)  : Promise<Role[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedRoles = await dbClient?.role?.updateMany({
            where: criteria,
            data: updateData,
          });

    return updatedRoles as Promise<Role[]>;
  }
}
