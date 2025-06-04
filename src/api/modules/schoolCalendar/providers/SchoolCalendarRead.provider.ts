import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SchoolCalendarCriteriaType, SchoolCalendarReadRequestType } from "~/api/modules/schoolCalendar/types/SchoolCalendarTypes";

@EnforceTenantId
export default class SchoolCalendarReadProvider {
  public async getByCriteria(criteria: SchoolCalendarReadRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { ids, tenantId } = criteria;

      const schoolCalendars = await dbClient.schoolCalendar.findMany({
        where: {
          ...(ids && { id: { in: ids } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          terms: {
            include: {
              breakWeeks: true,
            },
          },
        },
      });

      return schoolCalendars;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: SchoolCalendarCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { year, tenantId } = criteria;

      const schoolCalendar = await dbClient.schoolCalendar.findUnique({
        where: {
          year_tenantId: { year, tenantId },
        },
        include: {
          terms: {
            include: {
              breakWeeks: true,
            },
          },
        },
      });

      return schoolCalendar;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
