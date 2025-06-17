import { Staff } from "@prisma/client";
import { StaffCreateType } from "~/api/modules/staff/types/StaffTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StaffCreateProvider {
  public async create(data: StaffCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, employmentType, startDate, nin, tin, highestLevelEdu, cvUrl, userId, tenantId } = data;

      const staff = await dbClient?.staff.create({
        data: {
          jobTitle,
          employmentType,
          startDate,
          nin,
          highestLevelEdu,
          tin,
          cvUrl,
          userId,
          tenantId,
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
      throw new InternalServerError(error.message);
    }
  }
}
