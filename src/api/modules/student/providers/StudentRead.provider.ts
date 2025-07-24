import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentCriteriaType, StudentWithRelationsSafeUser } from "~/api/modules/student/types/StudentTypes";

@EnforceTenantId
export default class StudentReadProvider {
  public async getByCriteria(criteria: StudentCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentWithRelationsSafeUser[]> {
    try {
      const { ids, admissionNos, classId, classDivisionId, tenantId, dormitoryId, calendarId, excludePromotedInCalendarId } = criteria;

      const students = await dbClient.student.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(ids && { id: { in: ids } }),
          ...(admissionNos && { admissionNo: { in: admissionNos } }),
          ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
          ...(classId && { classId: Number(classId) }),
          ...(classDivisionId && { classDivisionId: Number(classDivisionId) }),
          ...(excludePromotedInCalendarId && {
            promotions: {
              none: {
                calendarId: Number(excludePromotedInCalendarId),
                tenantId: tenantId,
              },
            },
          }),
        },
        include: {
          user: { select: userObjectWithoutPassword },
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          classDivision: true,
          medicalHistory: true,
          studentGroups: true,
          subjectsRegistered: {
            where: {
              ...(calendarId && { calendarId: Number(calendarId) }),
            },
            include: {
              subject: true,
            },
          },
          promotions: {
            include: {
              fromClass: true,
              toClass: true,
              calendar: true,
            },
          },
        },
      });

      return students;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StudentCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<StudentWithRelationsSafeUser | null> {
    try {
      const { id, tenantId, calendarId, admissionNo } = criteria;
      const numericId = id ? Number(id) : undefined;

      const student = await dbClient?.student?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(numericId && { id: numericId }),
          ...(admissionNo && { admissionNo }),
        },
        include: {
          user: { select: userObjectWithoutPassword },
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
          classDivision: true,
          subjectsRegistered: {
            where: {
              ...(calendarId && { calendarId: Number(calendarId) }),
            },
            include: {
              subject: true,
            },
          },
        },
      });

      return student;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
