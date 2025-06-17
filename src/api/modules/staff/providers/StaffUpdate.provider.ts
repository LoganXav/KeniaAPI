import { Prisma, Staff } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StaffUpdateManyRequestType, StaffUpdateRequestType } from "~/api/modules/staff/types/StaffTypes";

@EnforceTenantId
export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffUpdateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, roleId, id, tenantId, nin, tin, cvUrl, highestLevelEdu, employmentType, startDate, subjectIds, classDivisionIds } = criteria;

      const numericId = Number(id);

      const updatedStaff = await dbClient?.staff?.update({
        where: {
          id: numericId,
          tenantId,
        },
        data: {
          ...(jobTitle && { jobTitle }),
          ...(roleId && { roleId }),
          ...(nin && { nin }),
          ...(tin && { tin }),
          ...(cvUrl && { cvUrl }),
          ...(highestLevelEdu && { highestLevelEdu }),
          ...(employmentType && { employmentType }),
          ...(startDate && { startDate }),
          ...(subjectIds !== undefined && {
            subjects: {
              set: subjectIds.map((id) => ({ id })),
            },
          }),
          ...(classDivisionIds !== undefined && {
            classDivisions: {
              set: classDivisionIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          user: true,
          role: true,
          subjects: true,
          classDivisions: true,
        },
      });

      if (updatedStaff?.user) {
        delete (updatedStaff.user as any).password;
      }

      return updatedStaff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateMany(criteria: StaffUpdateManyRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    try {
      const { roleId, jobTitle, ids, tenantId } = criteria;

      const updatedStaffs = await dbClient?.staff?.updateMany({
        where: {
          id: {
            in: ids,
          },
          tenantId,
        },
        data: {
          ...(roleId && { roleId }),
          ...(jobTitle && { jobTitle }),
        },
      });

      return updatedStaffs;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
