import { StudentCalendarResult } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentCalendarResultReadProvider {
  public async getOneByCriteria(criteria: { studentId: number; calendarId: number; tenantId: number }, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult | null> {
    try {
      const { studentId, calendarId, tenantId } = criteria;

      return await dbClient.studentCalendarResult.findFirst({
        where: {
          studentId,
          calendarId,
          tenantId,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
