import { Staff } from "@prisma/client";
import { StaffCreateType } from "~/api/modules/staff/types/StaffTypes";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StaffCreateProvider {
  public async create(data: StaffCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, employmentType, startDate, nin, tin, highestLevelEdu, cvUrl, userId, tenantId, roleId } = data;

      const staff = await dbClient?.staff.create({
        data: {
          jobTitle,
          employmentType,
          startDate,
          nin,
          highestLevelEdu,
          tin,
          roleId,
          cvUrl,
          userId,
          tenantId,
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
      throw new InternalServerError(error.message);
    }
  }
}
