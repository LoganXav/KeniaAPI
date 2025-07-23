import { SubjectRegistration } from "@prisma/client";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { StudentSubjectRegistrationReadType } from "~/api/modules/student/types/StudentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentSubjectRegistrationReadProvider {
  public async getByCriteria(args: StudentSubjectRegistrationReadType, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectRegistration[]> {
    const { studentId, calendarId, classId, classDivisionId, subjectId, tenantId, status } = args;

    try {
      const subjectRegistrations = await dbClient.subjectRegistration.findMany({
        where: {
          classId,
          tenantId,
          subjectId,
          ...(status && { status }),
          ...(studentId && { studentId }),
          ...(calendarId && { calendarId }),
          ...(classDivisionId && { classDivisionId }),
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
}
