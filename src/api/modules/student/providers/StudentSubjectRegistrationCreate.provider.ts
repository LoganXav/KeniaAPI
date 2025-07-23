import { StudentSubjectRegistrationCreateType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentSubjectRegistrationCreateProvider {
  public async create(args: StudentSubjectRegistrationCreateType, dbClient: PrismaTransactionClient = DbClient) {
    const { studentId, subjectId, calendarId, classId, classDivisionId, tenantId } = args;

    try {
      const subjectRegistration = await dbClient.subjectRegistration.create({
        data: {
          classId,
          tenantId,
          studentId,
          subjectId,
          calendarId,
          classDivisionId,
        },
      });

      return subjectRegistration;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
