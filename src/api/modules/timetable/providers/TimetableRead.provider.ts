import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableCriteriaType, TimetableType } from "../types/TimetableTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TimetableReadProvider {
  public async getByCriteria(criteria: TimetableCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<any[]> {
    try {
      const { id, ids, classDivisionId, day, tenantId } = criteria;

      const timetables = await dbClient.timetable.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(classDivisionId && { classDivisionId }),
          ...(day && { day }),
          ...(tenantId && { tenantId }),
        },
        include: {
          periods: {
            include: {
              subject: true,
            },
          },
        },
      });

      return timetables;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: TimetableCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, classDivisionId, day, tenantId, termId } = criteria;

      const timetable = await dbClient.timetable.findFirst({
        where: {
          ...(id && { id: Number(id) }),
          ...(termId && { termId: Number(termId) }),
          ...(classDivisionId && { classDivisionId: Number(classDivisionId) }),
          ...(day && { day }),
          ...(tenantId && { tenantId: Number(tenantId) }),
        },
        include: {
          periods: {
            include: {
              subject: true,
            },
          },
        },
      });

      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
