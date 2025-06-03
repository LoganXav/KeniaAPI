import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SubjectGradingCreateRequestType } from "~/api/modules/subject/types/SubjectGradingTypes";

@EnforceTenantId
export default class SubjectGradingReadProvider {
  public async getByCriteria(criteria: SubjectGradingCreateRequestType & { classId: number; classDivisionId: number }, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { subjectId, tenantId, calendarId, termId, studentId, classId, classDivisionId } = criteria;

      const subjectGradings = await dbClient.subjectGrading.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(calendarId && { calendarId }),
          ...(termId && { termId }),
          ...(classId && { classId }),
          ...(classDivisionId && { classDivisionId }),
          ...(studentId && { studentId }),
          ...(subjectId && { subjectId }),
        },
        include: {
          continuousAssessmentScores: true,
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
            include: {
              classDivision: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return subjectGradings;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async getOneByCriteria(criteria: SubjectGradingCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { subjectId, tenantId, calendarId, termId, studentId } = criteria;

      const subjectGrades = await dbClient.subjectGrading.findFirst({
        where: {
          ...(studentId && { studentId }),
          ...(subjectId && { subjectId }),
          ...(tenantId && { tenantId }),
          ...(calendarId && { calendarId }),
          ...(termId && { termId }),
        },
        include: {
          continuousAssessmentScores: true,
        },
      });

      return subjectGrades;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
