import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { SchoolCalendarDeleteRequestType } from "../types/SchoolCalendarTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class SchoolCalendarDeleteProvider {
  public async delete(args: SchoolCalendarDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const schoolCalendar = await dbClient.schoolCalendar.delete({
        where: {
          id,
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
}
