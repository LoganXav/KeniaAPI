import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Tenant, TenantMetadata } from "@prisma/client";
import { TenantCriteria, UpdateTenantData } from "../types/TenantTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TenantUpdateProvider {
  public async updateMetadata(args: any, dbClient: PrismaTransactionClient = DbClient): Promise<TenantMetadata> {
    const { tenantId, staff, student } = args;
    try {
      const newTenantMetadata = await dbClient?.tenantMetadata?.update({
        where: { tenantId },
        data: {
          ...(staff && { totalStaff: { increment: 1 } }),
          ...(student && { totalStudents: { increment: 1 } }),
        },
      });

      return newTenantMetadata;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

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
