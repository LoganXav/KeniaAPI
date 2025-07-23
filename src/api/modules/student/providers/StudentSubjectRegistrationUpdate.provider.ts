import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentSubjectRegistrationUpdateType } from "~/api/modules/student/types/StudentTypes";

@EnforceTenantId
export default class StudentSubjectRegistrationUpdateProvider {
  public async updateByCriteria(args: StudentSubjectRegistrationUpdateType, dbClient: PrismaTransactionClient = DbClient): Promise<{ count: number }> {
    const { studentId, tenantId, status, calendarId } = args;

    try {
      const result = await dbClient.subjectRegistration.updateMany({
        where: {
          tenantId,
          studentId,
          calendarId,
        },
        data: {
          ...(status && { status }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
