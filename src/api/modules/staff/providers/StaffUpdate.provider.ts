import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Prisma, Staff } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StaffUpdateManyRequestType, StaffUpdateRequestType } from "../types/StaffTypes";

export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffUpdateRequestType & { id: string; tenantId: number }, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, roleId, id, tenantId, nin, tin, cvUrl, highestLevelEdu, employmentType, startDate } = criteria;

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
        },
        include: {
          user: true,
          role: true,
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
      const { roleId, jobTitle, ids } = criteria;

      const updatedStaffs = await dbClient?.staff?.updateMany({
        where: {
          id: {
            in: ids,
          },
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

  // public async removeListFromStaff(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff> {
  //   const dbClient = tx ? tx : DbClient;
  //   const { groupIds, classIds, subjectIds } = updateData;
  //   try {
  //     const updatedStaff = await dbClient?.staff?.update({
  //       where: {
  //         id: criteria.id,
  //       },
  //       data: {
  //         ...(groupIds && {
  //           group: {
  //             disconnect: groupIds.map((groupId) => ({ id: groupId })),
  //           },
  //         }),
  //         ...(classIds && {
  //           classes: {
  //             disconnect: classIds.map((classId) => ({ id: classId })),
  //           },
  //         }),
  //         ...(subjectIds && {
  //           subjects: {
  //             disconnect: subjectIds.map((subjectId) => ({ id: subjectId })),
  //           },
  //         }),
  //       },
  //     });

  //     return updatedStaff as Promise<Staff>;
  //   } catch (error: any) {
  //     throw new InternalServerError(error.message);
  //   }
  // }
}
