import { StudentTermResult } from "@prisma/client";
import { StudentTermResultReadType } from "../types/StudentTypes";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentTermResultReadProvider {
  public async getByCriteria(criteria: StudentTermResultReadType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult[]> {
    try {
      const { studentId, termId, tenantId, classId, classDivisionId } = criteria;

      const results = await dbClient.studentTermResult.findMany({
        where: {
          ...(termId && { termId }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(studentId && { studentId }),
          ...(classDivisionId && { classDivisionId }),
        },
        include: {
          student: {
            include: {
              user: { select: userObjectWithoutPassword },
              subjectGrades: {
                include: {
                  subject: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  subjectsRegistered: true,
                },
              },
            },
          },
        },
      });

      return results;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async getOneByCriteria(criteria: StudentTermResultReadType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult | null> {
    try {
      const { studentId, termId, tenantId, classId, classDivisionId } = criteria;

      const result = await dbClient.studentTermResult.findFirst({
        where: {
          ...(termId && { termId }),
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
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async count(criteria: StudentTermResultReadType & { finalized: boolean }, dbClient: PrismaTransactionClient = DbClient): Promise<number> {
    try {
      const { studentId, termId, tenantId, classId, classDivisionId, finalized } = criteria;

      const count = await dbClient.studentTermResult.count({
        where: {
          ...(termId && { termId }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(studentId && { studentId }),
          ...(classDivisionId && { classDivisionId }),
          ...(finalized !== undefined && { finalized }),
        },
      });

      return count;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
