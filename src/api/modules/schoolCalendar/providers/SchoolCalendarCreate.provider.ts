import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SchoolCalendarCreateRequestType } from "~/api/modules/schoolCalendar/types/SchoolCalendarTypes";

@EnforceTenantId
export default class SchoolCalendarCreateProvider {
  public async create(args: SchoolCalendarCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { year, tenantId } = args;

      const schoolCalendar = await dbClient.schoolCalendar.create({
        data: {
          year,
          tenantId,
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

  public async createOrUpdate(args: Omit<SchoolCalendarCreateRequestType, "terms">, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { year, tenantId } = args;

      const schoolCalendar = await dbClient.schoolCalendar.upsert({
        where: {
          year_tenantId: { year, tenantId },
        },
        update: { year, tenantId },
        create: { year, tenantId },
      });

      return schoolCalendar;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
