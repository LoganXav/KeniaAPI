import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentCreateType } from "../types/StudentTypes";
import { Student } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentCreateProvider {
  public async create(data: StudentCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { userId, classId, tenantId, guardianName, guardianPhone, guardianEmail, admissionNo, enrollmentDate } = data;

      const student = await dbClient?.student.create({
        data: {
          userId,
          classId,
          tenantId,
          guardianName,
          guardianPhone,
          guardianEmail,
          admissionNo,
          enrollmentDate: enrollmentDate || new Date(),
        },
        include: {
          user: true,
          class: true,
        },
      });

      if (student?.user) {
        delete (student.user as any).password;
      }

      return student;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
