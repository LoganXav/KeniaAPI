import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentCreateType } from "../types/StudentTypes";
import { Student } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentCreateProvider {
  public async create(data: StudentCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { userId, classId, tenantId, studentId, enrollmentDate, admissionNo, currentGrade, languages, religion, bloodGroup, previousSchool, isActive } = data;

      const student = await dbClient?.student.create({
        data: {
          userId,
          classId,
          tenantId,
          studentId,
          enrollmentDate,
          admissionNo,
          currentGrade,
          languages,
          religion,
          bloodGroup,
          previousSchool,
          isActive,
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

      if (student.user) {
        delete (student.user as any).password;
      }

      return student;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
