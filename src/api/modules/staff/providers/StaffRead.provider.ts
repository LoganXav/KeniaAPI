import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteriaType } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffReadProvider {
  public async getByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff[]> {
    try {
      const { id, ids, jobTitle, userId, roleId, groupId, classId, subjectId, tenantId } = criteria;

      const staffs = await dbClient.staff.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(jobTitle && { jobTitle: { contains: jobTitle } }),
          ...(userId && { userId }),
          ...(roleId && { roleId }),
          ...(groupId && { group: { some: { id: groupId } } }),
          ...(classId && { classes: { some: { id: classId } } }),
          ...(subjectId && { subjects: { some: { id: subjectId } } }),
        },
        include: {
          user: true,
          role: true,
        },
      });

      return staffs;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StaffCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff | null> {
    try {
      const { id } = criteria;
      const numericId = id ? Number(id) : undefined;

      const result = await dbClient?.staff?.findFirst({
        where: {
          ...(numericId && { id: numericId }),
        },
        include: {
          user: true,
          role: true,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
