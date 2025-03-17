import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { PeriodCriteriaType } from "../types/PeriodTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class PeriodReadProvider {
  public async getByCriteria(criteria: PeriodCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, timetableId, subjectId, tenantId } = criteria;

      const periods = await dbClient.period.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(timetableId && { timetableId }),
          ...(subjectId && { subjectId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          subject: true,
        },
      });

      return periods;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: PeriodCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, timetableId, subjectId, tenantId } = criteria;

      const period = await dbClient.period.findFirst({
        where: {
          ...(id && { id }),
          ...(timetableId && { timetableId }),
          ...(subjectId && { subjectId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          subject: true,
        },
      });

      return period;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
