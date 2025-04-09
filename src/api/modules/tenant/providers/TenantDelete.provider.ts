import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Tenant } from "@prisma/client";
import { TenantReadCriteria } from "../types/TenantTypes";

export default class StaffDeleteProvider {
  public async deleteOneByCriteria(criteria: TenantReadCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Tenant | any> {
    const { id } = criteria;
    const deletedTenant = await dbClient?.tenant?.delete({
      where: { id },
    });
    return deletedTenant;
  }

  public async deleteByCriteria(criteria: TenantReadCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Tenant | any> {
    const deletedTenant = await dbClient?.tenant?.deleteMany({
      where: criteria,
    });
    return deletedTenant;
  }
}
