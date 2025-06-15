import { TimetableCriteriaType } from "~/api/modules/timetable/types/TimetableTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TimetableReadProvider {
  public async getByCriteria(criteria: TimetableCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<any[]> {
    try {
      const { id, ids, classDivisionId, day, termId, tenantId } = criteria;

      const timetables = await dbClient.timetable.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(classDivisionId && { classDivisionId }),
          ...(day && { day }),
          ...(termId && { termId }),
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

      const timetable = await dbClient.timetable.findUnique({
        where: {
          day_classDivisionId_termId_tenantId: {
            day,
            classDivisionId,
            termId,
            tenantId,
          },
        },
        include: { periods: { include: { subject: true } } },
      });

      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
