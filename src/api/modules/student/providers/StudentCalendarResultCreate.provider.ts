import { StudentCalendarResult } from "@prisma/client";
import { StudentCalendarResultCreateType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentCalendarResultCreateProvider {
  public async create(args: StudentCalendarResultCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult> {
    try {
      const { studentId, calendarId, tenantId, totalScore, averageScore, subjectCountGraded, finalized, finalizedTermResultsCount, classId, classDivisionId } = args;

      const result = await dbClient.studentCalendarResult.create({
        data: {
          calendarId,
          classId,
          tenantId,
          studentId,
          finalized,
          finalizedTermResultsCount,
          totalScore,
          averageScore,
          classDivisionId,
          subjectCountGraded,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
