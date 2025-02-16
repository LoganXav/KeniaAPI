import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { StudentCriteriaType } from "../types/StudentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentReadProvider {
  public async getAllStudent(tx?: any): Promise<Student[]> {
    const dbClient = tx ? tx : DbClient;
    const students = await dbClient?.student?.findMany({
      include: {
        user: true,
        class: true,
        guardians: true,
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
      const { ids, userId, classId, admissionNo, tenantId, studentId, isActive } = criteria;

      const students = await dbClient.student.findMany({
        where: {
          ...(tenantId && { tenantId }),
          ...(ids && { id: { in: ids } }),
          ...(userId && { userId: Number(userId) }),
          ...(classId && { classId: Number(classId) }),
          ...(admissionNo && { admissionNo }),
          ...(studentId && { studentId }),
          ...(typeof isActive !== "undefined" && { isActive }),
        },
        include: {
          user: true,
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
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

  public async getOneByCriteria(criteria: StudentCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<Student | null> {
    try {
      const { id, tenantId, studentId, admissionNo } = criteria;
      const numericId = id ? Number(id) : undefined;

      const student = await dbClient?.student?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(numericId && { id: numericId }),
          ...(studentId && { studentId }),
          ...(admissionNo && { admissionNo }),
        },
        include: {
          user: true,
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
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
