import { StudentTermResult } from "@prisma/client";
import { StudentTermResultCreateType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentTermResultCreateProvider {
  public async create(args: StudentTermResultCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult> {
    try {
      const { studentId, termId, tenantId, totalScore, averageScore, subjectCountGraded, subjectCountOffered, finalized, classId, classDivisionId } = args;

      const result = await dbClient.studentTermResult.create({
        data: {
          termId,
          classId,
          tenantId,
          studentId,
          finalized,
          totalScore,
          averageScore,
          classDivisionId,
          subjectCountGraded,
          subjectCountOffered,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
