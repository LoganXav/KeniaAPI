import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria, UpdateStaffData } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const { jobTitle, userId, roleId, groupIds, classIds, subjectIds } = updateData;

    try {
      const updatedStaff = await dbClient?.staff?.update({
        where: {
          ...(criteria.id && { id: criteria.id }),
          ...(criteria.userId && { userId: criteria.userId }),
        },
        data: {
          ...(jobTitle && { jobTitle }),
          ...(userId && { userId }),
          ...(roleId && { roleId }),
          ...(groupIds && {
            group: {
              set: [],
              connect: groupIds.map((groupId) => ({ id: groupId })),
            },
          }),
          ...(classIds && {
            classes: {
              set: [],
              connect: classIds.map((classId) => ({ id: classId })),
            },
          }),
          ...(subjectIds && {
            subjects: {
              set: [],
              connect: subjectIds.map((subjectId) => ({ id: subjectId })),
            },
          }),
        },
      });
      return updatedStaff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateMany(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff[]> {
    const { userId, roleId, groupIds, classIds, subjectIds } = updateData;
    const dbClient = tx ? tx : DbClient;
    try {
      const updatedStaffs = await dbClient?.staff?.updateMany({
        where: {
          ...(criteria.id && { id: criteria.id }),
          ...(criteria.userId && { userId: criteria.userId }),
        },
        data: {
          ...(userId && { userId }),
          ...(roleId && { roleId }),
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

      return updatedStaffs as Promise<Staff[]>;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async removeListFromStaff(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const { groupIds, classIds, subjectIds } = updateData;
    try {
      const updatedStaff = await dbClient?.staff?.update({
        where: {
          id: criteria.id,
        },
        data: {
          ...(groupIds && {
            group: {
              disconnect: groupIds.map((groupId) => ({ id: groupId })),
            },
          }),
          ...(classIds && {
            classes: {
              disconnect: classIds.map((classId) => ({ id: classId })),
            },
          }),
          ...(subjectIds && {
            subjects: {
              disconnect: subjectIds.map((subjectId) => ({ id: subjectId })),
            },
          }),
        },
      });

      return updatedStaff as Promise<Staff>;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
