import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TimetableDeleteRequestType } from "~/api/modules/timetable/types/TimetableTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TimetableDeleteProvider {
  public async delete(args: TimetableDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const timetable = await dbClient.timetable.delete({
        where: {
          id,
          tenantId,
        },
        include: {
          periods: true,
        },
      });

      return timetable;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
