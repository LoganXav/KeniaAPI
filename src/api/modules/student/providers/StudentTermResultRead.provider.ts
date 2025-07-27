import { StudentTermResult } from "@prisma/client";
import { StudentTermResultReadType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentTermResultReadProvider {
  public async getByCriteria(criteria: StudentTermResultReadType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult[]> {
    try {
      const { studentId, termId, tenantId } = criteria;

      const results = await dbClient.studentTermResult.findMany({
        where: {
          ...(studentId && { studentId }),
          ...(termId && { termId }),
          ...(tenantId && { tenantId }),
        },
      });

      return results;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async getOneByCriteria(criteria: StudentTermResultReadType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentTermResult | null> {
    try {
      const { studentId, termId, tenantId } = criteria;

      const result = await dbClient.studentTermResult.findFirst({
        where: {
          ...(studentId && { studentId }),
          ...(termId && { termId }),
          ...(tenantId && { tenantId }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
