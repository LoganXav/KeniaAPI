import DbClient from "~/infrastructure/internal/database";
import { Tenant } from "@prisma/client";
import { TenantCriteria, UpdateTenantData } from "../types/TenantTypes";

export default class TenantUpdateProvider {
  public async updateOneByCriteria(criteria: TenantCriteria, updateData: UpdateTenantData, tx?: any): Promise<Tenant> {
    const dbClient = tx ? tx : DbClient;
    const updatedTenant = await dbClient?.tenant?.update({
      where: criteria,
      data: updateData,
    });

    return updatedTenant as Promise<Tenant>;
  }

  public async updateByCriteria(criteria: TenantCriteria, updateData: UpdateTenantData, tx?: any): Promise<Tenant[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedTenants = await dbClient?.tenant?.updateMany({
      where: criteria,
      data: updateData,
    });

    return updatedTenants as Promise<Tenant[]>;
  }
}
