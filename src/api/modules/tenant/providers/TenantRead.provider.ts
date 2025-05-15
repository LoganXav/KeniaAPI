import { Tenant } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { TenantReadCriteria, TenantRecordWithRelations } from "~/api/modules/tenant/types/TenantTypes";

export default class TenantReadProvider {
  public async getAllTenant(tx?: any): Promise<Tenant[]> {
    const dbClient = tx ? tx : DbClient;
    const tenants = await dbClient?.tenants?.findMany();

    return tenants;
  }

  public async getByCriteria(criteria: TenantReadCriteria, tx?: any): Promise<Tenant[]> {
    const dbClient = tx ? tx : DbClient;
    const staffs = await dbClient?.staff?.findMany({
      where: criteria,
    });

    return staffs;
  }

  public async getOneByCriteria(criteria: TenantReadCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<TenantRecordWithRelations | null> {
    try {
      const { id } = criteria;
      const result = await dbClient?.tenant?.findFirst({
        where: {
          ...(id && { id }),
        },
        include: {
          staffs: {
            include: {
              role: true,
            },
          },
          students: true,
          metadata: true,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
