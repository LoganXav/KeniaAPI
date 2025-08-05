import { StudentCalendarResult } from "@prisma/client";
import { StudentCalendarResultUpdateType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentCalendarResultUpdateProvider {
  public async update(args: StudentCalendarResultUpdateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult> {
    try {
      const { studentId, calendarId, tenantId, averageScore, finalized, subjectCountGraded, totalScore } = args;

      const result = await dbClient.studentCalendarResult.update({
        where: {
          studentId_calendarId_tenantId: {
            studentId,
            calendarId,
            tenantId,
          },
        },
        data: {
          averageScore,
          finalized,
          subjectCountGraded,
          totalScore,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
