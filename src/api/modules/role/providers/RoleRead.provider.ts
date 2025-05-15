import { Role } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { RoleReadCriteria } from "~/api/modules/role/types/RoleTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class RoleReadProvider {
  public async getAllRole(dbClient: PrismaTransactionClient = DbClient): Promise<Role[]> {
    try {
      const roles = await dbClient?.role?.findMany();
      return roles;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getByCriteria(criteria: RoleReadCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Role[]> {
    try {
      const { id, name, tenantId } = criteria;

      const roles = await dbClient?.role?.findMany({
        where: {
          ...(id && { id: Number(id) }),
          ...(name && { name: { contains: name } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          permissions: true,
        },
      });

      return roles;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: RoleReadCriteria, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = criteria;

      const role = await dbClient?.role?.findFirst({
        where: {
          ...(id && { id }),
          ...(tenantId && { tenantId }),
        },
        include: {
          permissions: true,
        },
      });

      return role;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
