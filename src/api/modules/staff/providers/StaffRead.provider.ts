import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteriaType } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffReadProvider {
  public async getAllStaff(tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const _staffs = await dbClient?.staff?.findMany();

    const staffs = _staffs.map(({ password, ...otherStaffInto }) => otherStaffInto);
    return staffs;
  }

  public async getByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff[]> {
    const { id, ids, jobTitle, userId, roleId, groupId, classId, subjectId } = criteria;
    const _staffs = await dbClient?.staff?.findMany({
      where: {
        ...(id && { id: id }),
        id: {
          in: ids,
        },
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

    const staffs = _staffs.map(({ password, ...otherStaffInfo }) => otherStaffInfo);
    return staffs;
  }

  public async getOneByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff | null> {
    try {
      const { id } = criteria;
      const numericId = id ? Number(id) : undefined;

      const result = await dbClient?.staff?.findFirst({
        where: {
          ...(numericId && { id: numericId }),
        },
      });

      if (result) {
        const { password, ...staff } = result;
        return staff;
      }

      return null;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
