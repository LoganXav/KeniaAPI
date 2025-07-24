import { SubjectGrading } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SubjectGradingCreateRequestType } from "~/api/modules/subject/types/SubjectGradingTypes";

@EnforceTenantId
export default class SubjectGradingCreateProvider {
  public async createOrUpdate(args: SubjectGradingCreateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectGrading> {
    try {
      const { tenantId, studentId, subjectId, calendarId, termId, examScore, grade, remark, continuousAssessmentScores, totalScore, student, totalContinuousScore } = args;

      const subjectGrading = await dbClient.subjectGrading.upsert({
        where: {
          studentId_subjectId_calendarId_termId: {
            studentId,
            subjectId,
            calendarId,
            termId,
          },
        },
        update: {
          totalContinuousScore,
          examScore,
          totalScore,
          grade,
          remark,
          continuousAssessmentScores: {
            deleteMany: {},
            create: continuousAssessmentScores.map((ca) => ({
              name: ca.name,
              score: ca.score,
            })),
          },
          tenant: { connect: { id: tenantId } },
          student: { connect: { id: studentId } },
          subject: { connect: { id: subjectId } },
          class: { connect: { id: student.classId! } },
          classDivision: { connect: { id: student.classDivisionId! } },
          calendar: { connect: { id: calendarId } },
          term: { connect: { id: termId } },
        },
        create: {
          totalContinuousScore,
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
          class: { connect: { id: student.classId! } },
          classDivision: { connect: { id: student.classDivisionId! } },
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

  public async createOrUpdateMany(): Promise<void> {
    try {
      return;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
