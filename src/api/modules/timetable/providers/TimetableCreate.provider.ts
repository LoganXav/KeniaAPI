import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableCreateRequestType } from "~/api/modules/timetable/types/TimetableTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TimetableCreateProvider {
  public async createOrUpdate(args: TimetableCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, day, classDivisionId, tenantId, termId } = args;

      const timetable = await dbClient.timetable.upsert({
        where: { id: id || 0 },
        update: {
          day,
          classDivisionId,
          tenantId,
          termId,
        },
        create: {
          day,
          classDivisionId,
          tenantId,
          termId,
        },
      });
      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
