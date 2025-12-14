import { StudentCalendarResult } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentCalendarResultSaveTermAverageScoresType, StudentCalendarResultUpdateType } from "../types/StudentTypes";

@EnforceTenantId
export default class StudentCalendarResultUpdateProvider {
  public async update(args: StudentCalendarResultUpdateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult> {
    try {
      const { studentId, calendarId, tenantId, finalized, finalizedTermResultsCount } = args;

      const result = await dbClient.studentCalendarResult.update({
        where: {
          studentId_calendarId_tenantId: {
            studentId,
            calendarId,
            tenantId,
          },
        },
        data: {
          finalized,
          finalizedTermResultsCount,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async finalizeCalendarResults(args: StudentCalendarResultUpdateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult> {
    try {
      const { studentId, calendarId, tenantId, finalized } = args;

      const result = await dbClient.studentCalendarResult.update({
        where: {
          studentId_calendarId_tenantId: {
            studentId,
            calendarId,
            tenantId,
          },
        },
        data: {
          finalized,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async saveTermAverageScores(args: StudentCalendarResultSaveTermAverageScoresType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { tenantId, studentCalendarResultId, studentCalendarTermAverageScores } = args;

      return await dbClient.studentCalendarTermAverage.upsert({
        where: {
          studentCalendarResultId_termId_tenantId: {
            studentCalendarResultId,
            termId: studentCalendarTermAverageScores.termId,
            tenantId,
          },
        },
        create: {
          studentCalendarResultId,
          termId: studentCalendarTermAverageScores.termId,
          tenantId,
          averageScore: studentCalendarTermAverageScores.averageScore,
        },
        update: {
          averageScore: studentCalendarTermAverageScores.averageScore,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

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
