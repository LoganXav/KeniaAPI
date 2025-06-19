import { Prisma, SubjectRegistration } from "@prisma/client";
import { StudentSubjectRegistrationDeleteType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentSubjectRegistrationDeleteProvider {
  public async delete(args: StudentSubjectRegistrationDeleteType, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectRegistration> {
    const { studentId, subjectId, calendarId, tenantId } = args;

    try {
      return await dbClient.subjectRegistration.delete({
        where: {
          studentId_subjectId_calendarId_tenantId: {
            studentId,
            subjectId,
            calendarId,
            tenantId,
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async deleteMany(args: Omit<StudentSubjectRegistrationDeleteType, "subjectId">, dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    const { studentId, calendarId, tenantId } = args;

    try {
      return await dbClient.subjectRegistration.deleteMany({
        where: {
          studentId,
          calendarId,
          tenantId,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
