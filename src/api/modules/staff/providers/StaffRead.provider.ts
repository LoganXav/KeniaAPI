import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria } from "../types/StaffTypes";

export default class StaffReadProvider {
  public async getAllStaff(tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const staffs = await dbClient?.staff?.findMany();

    return staffs;
  }

  public async getByCriteria(criteria: StaffCriteria, tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const { id, jobTitle, userId, roleId, groupId, classId, subjectId } = criteria;
    const staffs = await dbClient?.staff?.findMany({
      where: {
        ...(id && { id: id }),
        ...(jobTitle && {
          jobTitle: {
            contains: jobTitle,
          },
        }),
        ...(userId && { userId }),
        ...(roleId && { roleId }),
        ...(groupId && {
          group: {
            some: {
              id: groupId,
            },
          },
        }),
        ...(classId && {
          class: {
            some: {
              id: classId,
            },
          },
        }),
        ...(subjectId && {
          subject: {
            some: {
              id: subjectId,
            },
          },
        }),
      },
    });

    return staffs;
  }

  public async getOneByCriteria(criteria: StaffCriteria, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const { id, jobTitle, userId, roleId, groupId, classId, subjectId } = criteria;
    const staff = await dbClient?.staff?.findFirst({
      where: {
        ...(id && { id: id }),
        ...(jobTitle && {
          jobTitle: {
            contains: jobTitle,
          },
        }),
        ...(userId && { userId }),
        ...(roleId && { roleId }),
        ...(groupId && {
          group: {
            some: {
              id: groupId,
            },
          },
        }),
        ...(classId && {
          class: {
            some: {
              id: classId,
            },
          },
        }),
        ...(subjectId && {
          subject: {
            some: {
              id: subjectId,
            },
          },
        }),
      },
    });

    return staff;
  }
}
