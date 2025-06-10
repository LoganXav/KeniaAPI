import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StaffCriteriaType, StaffWithRelationsType } from "~/api/modules/staff/types/StaffTypes";

@EnforceTenantId
export default class StaffReadProvider {
  public async getByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<StaffWithRelationsType[]> {
    try {
      const { ids, jobTitle, userId, roleId, tenantId } = criteria;

      const staffs = await dbClient.staff.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(ids && { id: { in: ids } }),
          ...(jobTitle && { jobTitle: { contains: jobTitle } }),
          ...(userId && { userId }),
          ...(roleId && { roleId }),
        },
        include: {
          user: true,
          role: true,
          subjects: true,
          classDivisions: true,
        },
      });

      staffs.forEach((staff) => {
        if (staff?.user) {
          delete (staff.user as any).password;
        }
      });

      return staffs;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<StaffWithRelationsType | null> {
    try {
      const { id, tenantId } = criteria;
      const numericId = id ? Number(id) : undefined;

      const staff = await dbClient?.staff?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(numericId && { id: numericId }),
        },
        include: {
          user: true,
          role: true,
          subjects: true,
          classDivisions: true,
        },
      });

      if (staff?.user) {
        delete (staff.user as any).password;
      }

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
