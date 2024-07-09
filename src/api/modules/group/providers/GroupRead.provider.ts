import DbClient from "~/infrastructure/internal/database";
import { Role } from "@prisma/client";
import { RoleCriteria } from "../types/RoleTypes";

export default class RoleReadProvider {
  public async getAllRole(tx?: any): Promise<Role[]> {
    const dbClient = tx ? tx : DbClient;
    const roles = await dbClient?.role?.findMany();

    return roles;
  }

  public async getByCriteria(criteria: RoleCriteria, tx?: any): Promise<Role[]> {
    const dbClient = tx ? tx : DbClient;
    const roles = await dbClient?.role?.findMany({
      where: criteria,
    });

    return roles;
  }

  public async getOneByCriteria(criteria: RoleCriteria, tx?: any): Promise<Role> {
    const dbClient = tx ? tx : DbClient;
    const role = await dbClient?.role?.findFirst({
      where: criteria,
    });

    return role;
  }
}
