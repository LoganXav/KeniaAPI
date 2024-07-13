import DbClient from "~/infrastructure/internal/database";
import { Tenant } from "@prisma/client";
import { TenantCriteria } from "../types/TenantTypes";

export default class TenantReadProvider {
  public async getAllTenant(tx?: any): Promise<Tenant[]> {
    const dbClient = tx ? tx : DbClient;
    const tenants = await dbClient?.tenants?.findMany();

    return tenants;
  }

  public async getByCriteria(criteria: TenantCriteria, tx?: any): Promise<Tenant[]> {
    const dbClient = tx ? tx : DbClient;
    const staffs = await dbClient?.staff?.findMany({
      where: criteria,
    });

    return staffs;
  }

  public async getOneByCriteria(criteria: TenantCriteria, tx?: any): Promise<Tenant> {
    const dbClient = tx ? tx : DbClient;
    const tenant = await dbClient?.tenants?.findFirst({
      where: criteria,
    });

    return tenant;
  }
}
