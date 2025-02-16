import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionCriteriaType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class ClassDivisionReadProvider {
  public async getByCriteria(criteria: ClassDivisionCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, classId, tenantId } = criteria;

      const classDivisions = await dbClient.classDivision.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          class: true,
        },
      });

      return classDivisions;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassDivisionCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId } = criteria;

      const classDivision = await dbClient.classDivision.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          class: true,
        },
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
