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

  public async updateOneByCriteria(args: any, dbClient: PrismaTransactionClient = DbClient): Promise<Tenant> {
    try {
      const { tenantId, onboardingStatus } = args;
      const updatedTenant = await dbClient?.tenant?.update({
        where: { id: tenantId },
        data: {
          ...(onboardingStatus && { onboardingStatus }),
        },
      });

      return updatedTenant;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
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
