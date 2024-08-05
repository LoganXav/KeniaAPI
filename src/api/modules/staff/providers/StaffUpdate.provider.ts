import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria, UpdateStaffData } from "../types/StaffTypes";

export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const { userId, roleId, groupIds, classIds, subjectIds } = updateData;
    const updatedStaff = await dbClient?.staff?.update({
      where: {
        id: criteria.id,
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
  }

  public async updateMany(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff[]> {
    const { userId, roleId, groupIds, classIds, subjectIds } = updateData;
    const dbClient = tx ? tx : DbClient;
    const updatedStaffs = await dbClient?.staff?.updateMany({
      where: criteria,
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
  }

  public async removeListFromStaff(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const { groupIds, classIds, subjectIds } = updateData;
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
  }
}
