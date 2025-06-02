import { Student, Subject } from "@prisma/client";
import { StudentCriteriaType } from "~/api/modules/student/types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class StudentReadProvider {
  public async getAllStudent(dbClient: PrismaTransactionClient = DbClient): Promise<Student[]> {
    const students = await dbClient?.student?.findMany({
      include: {
        user: true,
        class: true,
        guardians: true,
        subjects: true,
        classDivision: true,
        documents: true,
        dormitory: true,
        medicalHistory: true,
        studentGroups: true,
      },
    });

    return students;
  }

  public async getByCriteria(criteria: StudentCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Student[]> {
    try {
      const { ids, classId, tenantId, dormitoryId } = criteria;

      const students = await dbClient.student.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(ids && { id: { in: ids } }),
          ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
          ...(classId && { classId: Number(classId) }),
        },
        include: {
          user: true,
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          classDivision: true,
          subjects: true,
          medicalHistory: true,
          studentGroups: true,
        },
      });

      students.forEach((student) => {
        if (student.user) {
          delete (student.user as any).password;
        }
      });

      return students;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StudentCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<(Student & { subjects: Subject[] }) | null> {
    try {
      const { id, tenantId } = criteria;
      const numericId = id ? Number(id) : undefined;

      const student = await dbClient?.student?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(numericId && { id: numericId }),
        },
        include: {
          user: true,
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
          subjects: true,
          classDivision: true,
        },
      });

      if (student?.user) {
        delete (student.user as any).password;
      }

      return student;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
