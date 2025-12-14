import { StudentCalendarResult } from "@prisma/client";
import { StudentCalendarResultReadType } from "../types/StudentTypes";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
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

  public async getByCriteria(criteria: StudentCalendarResultReadType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentCalendarResult[]> {
    try {
      const { studentId, calendarId, tenantId, classId, classDivisionId } = criteria;

      const results = await dbClient.studentCalendarResult.findMany({
        where: {
          ...(calendarId && { calendarId }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(studentId && { studentId }),
          ...(classDivisionId && { classDivisionId }),
        },
        include: {
          student: {
            include: {
              user: { select: userObjectWithoutPassword },
            },
          },
          studentCalendarTermAverageScores: {
            include: { term: true },
          },
        },
      });

      return results;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
