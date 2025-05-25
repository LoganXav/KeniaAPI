import { SubjectGrading } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SubjectGradingCreateRequestType } from "~/api/modules/subject/types/SubjectGradingTypes";

@EnforceTenantId
export default class SubjectGradingCreateProvider {
  public async createOrUpdate(args: SubjectGradingCreateRequestType & { grade: string; remark: string; totalScore: number }, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectGrading> {
    try {
      const { id, tenantId, studentId, subjectId, classId, calendarId, termId, examScore, grade, remark, continuousAssessmentScores, totalScore } = args;

      const subjectGrading = await dbClient.subjectGrading.upsert({
        where: { id: id ?? 0 },
        update: {
          examScore,
          totalScore,
          grade,
          remark,
          continuousAssessmentScores: {
            create: continuousAssessmentScores.map((ca) => ({
              name: ca.name,
              score: ca.score,
            })),
          },
          tenant: { connect: { id: tenantId } },
          student: { connect: { id: studentId } },
          subject: { connect: { id: subjectId } },
          class: { connect: { id: classId } },
          calendar: { connect: { id: calendarId } },
          term: { connect: { id: termId } },
        },
        create: {
          examScore,
          totalScore,
          grade,
          remark,
          continuousAssessmentScores: {
            create: continuousAssessmentScores.map((ca) => ({
              name: ca.name,
              score: ca.score,
            })),
          },
          tenant: { connect: { id: tenantId } },
          student: { connect: { id: studentId } },
          subject: { connect: { id: subjectId } },
          class: { connect: { id: classId } },
          calendar: { connect: { id: calendarId } },
          term: { connect: { id: termId } },
        },
        include: {
          continuousAssessmentScores: true,
        },
      });

      return subjectGrading;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
