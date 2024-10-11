import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteriaType } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffReadProvider {
  public async getAllStaff(tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const staffs = await dbClient?.staff?.findMany();

    return staffs;
  }

  public async getByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff[]> {
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

  public async getOneByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff | null> {
    try {
      const { id } = criteria;
      const numericId = id ? Number(id) : undefined;

      const result = await dbClient?.staff?.findFirst({
        where: {
          ...(numericId && { id: numericId }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
