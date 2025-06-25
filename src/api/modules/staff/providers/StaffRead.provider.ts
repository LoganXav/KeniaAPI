import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
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
          user: { select: userObjectWithoutPassword },
          role: true,
          subjects: true,
          classDivisions: true,
        },
      });

      return staffs;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<StaffWithRelationsType | null> {
    try {
      const { id, tenantId, userId } = criteria;
      const numericId = id ? Number(id) : undefined;

      const staff = await dbClient?.staff?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(numericId && { id: numericId }),
          ...(!numericId && { userId }),
        },
        include: {
          user: { select: userObjectWithoutPassword },
          role: true,
          subjects: true,
          classDivisions: true,
        },
      });

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
