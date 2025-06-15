import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableCreateRequestType } from "~/api/modules/timetable/types/TimetableTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TimetableCreateProvider {
  public async createOrUpdate(args: TimetableCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { day, classDivisionId, termId, tenantId } = args;

      const timetable = await dbClient.timetable.upsert({
        where: {
          day_classDivisionId_termId_tenantId: {
            day,
            classDivisionId,
            termId,
            tenantId,
          },
        },
        update: {
          day,
          classDivisionId,
          termId,
          tenantId,
        },
        create: {
          day,
          classDivisionId,
          termId,
          tenantId,
        },
      });

      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
