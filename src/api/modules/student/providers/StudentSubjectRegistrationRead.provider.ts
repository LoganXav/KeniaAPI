import { Status, SubjectRegistration } from "@prisma/client";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { StudentSubjectRegistrationReadType } from "~/api/modules/student/types/StudentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentSubjectRegistrationReadProvider {
  public async getByCriteria(args: StudentSubjectRegistrationReadType & { studentIds?: number[] }, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectRegistration[]> {
    const { studentId, studentIds, calendarId, classId, classDivisionId, subjectId, tenantId, status } = args;

    try {
      const subjectRegistrations = await dbClient.subjectRegistration.findMany({
        where: {
          classId,
          tenantId,
          subjectId,
          ...(status && { status }),
          ...(calendarId && { calendarId }),
          ...(classDivisionId && { classDivisionId }),
          ...(studentIds && studentIds.length > 0 ? { studentId: { in: studentIds } } : studentId ? { studentId } : {}),
        },
        include: {
          student: {
            include: {
              user: { select: userObjectWithoutPassword },
              class: true,
            },
          },
        },
      });

      return subjectRegistrations;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async count(args: { studentId: number; calendarId?: number; tenantId?: number; status?: Status }, dbClient: PrismaTransactionClient = DbClient): Promise<number> {
    const { studentId, calendarId, tenantId, status } = args;

    try {
      const count = await dbClient.subjectRegistration.count({
        where: {
          tenantId,
          ...(status && { status }),
          ...(calendarId && { calendarId }),
          ...(studentId && { studentId }),
        },
      });

      return count;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
