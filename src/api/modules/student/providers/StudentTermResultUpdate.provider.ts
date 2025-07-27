import { StudentTermResult } from "@prisma/client";
import { StudentTermResultUpdateType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentTermResultUpdateProvider {
  public async update(args: StudentTermResultUpdateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult> {
    try {
      const { studentId, termId, tenantId, averageScore, finalized, subjectCountGraded, subjectCountOffered, totalScore } = args;

      const result = await dbClient.studentTermResult.update({
        where: {
          studentId_termId_tenantId: {
            studentId,
            termId,
            tenantId,
          },
        },
        data: {
          averageScore,
          finalized,
          subjectCountGraded,
          subjectCountOffered,
          totalScore,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
