import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Prisma, Staff } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StaffUpdateManyRequestType, StaffUpdateRequestType } from "../types/StaffTypes";

export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffUpdateRequestType & { id: string }, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, roleId, groupIds, classIds, subjectIds, id, userId } = criteria;

      const numericId = Number(id);
      const numericUserId = Number(userId);

      const updatedStaff = await dbClient?.staff?.update({
        where: {
          id: numericId,
          userId: numericUserId,
        },
        data: {
          ...(jobTitle && { jobTitle }),
          ...(roleId && { roleId }),
          ...(groupIds && {
            group: {
              set: [],
              connect: groupIds.map((groupId: number) => ({ id: groupId })),
            },
          }),
          ...(classIds && {
            classes: {
              set: [],
              connect: classIds.map((classId: number) => ({ id: classId })),
            },
          }),
          ...(subjectIds && {
            subjects: {
              set: [],
              connect: subjectIds.map((subjectId: number) => ({ id: subjectId })),
            },
          }),
        },
      });
      return updatedStaff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateMany(criteria: StaffUpdateManyRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    try {
      const { roleId, jobTitle, groupIds, classIds, subjectIds, ids } = criteria;

      const updatedStaffs = await dbClient?.staff?.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          ...(roleId && { roleId }),
          ...(jobTitle && { jobTitle }),
          ...(groupIds && {
            group: {
              connect: groupIds.map((groupId) => ({ id: groupId })),
            },
          }),
          ...(classIds && {
            classes: {
              connect: classIds.map((classId) => ({ id: classId })),
            },
          }),
          ...(subjectIds && {
            subjects: {
              connect: subjectIds.map((subjectId) => ({ id: subjectId })),
            },
          }),
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
