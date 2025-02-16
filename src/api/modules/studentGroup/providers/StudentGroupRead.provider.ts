import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentGroupCriteriaType } from "../types/StudentGroupTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentGroupReadProvider {
  public async getByCriteria(criteria: StudentGroupCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, tenantId } = criteria;

      const studentGroups = await dbClient.studentGroup.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          students: true,
        },
      });

      return studentGroups;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StudentGroupCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = criteria;

      const studentGroup = await dbClient.studentGroup.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          students: true,
        },
      });

      return studentGroup;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
