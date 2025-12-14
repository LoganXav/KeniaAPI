import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentCalendarResultDeleteProvider {
  public async deleteTermAverageScores(
    args: {
      tenantId: number;
      studentCalendarResultId: number;
      termId: number;
    },
    dbClient: PrismaTransactionClient = DbClient
  ) {
    try {
      return await dbClient.studentCalendarTermAverage.deleteMany({
        where: {
          tenantId: args.tenantId,
          studentCalendarResultId: args.studentCalendarResultId,
          termId: args.termId,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
