import { Student } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { StudentCriteriaType } from "~/api/modules/student/types/StudentTypes";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";

@EnforceTenantId
export default class StudentDeleteProvider {
  public async deleteOne(criteria: StudentCriteriaType, tx?: any): Promise<Student | null> {
    try {
      const dbClient = tx ? tx : DbClient;
      const toDelete = await dbClient?.student?.findFirst({
        where: criteria,
        include: {
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
        },
      });

      if (!toDelete) {
        throw new BadRequestError(`Student ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
      }

      // First delete related records
      await Promise.all([
        dbClient.guardian.deleteMany({ where: { studentId: toDelete.id } }),
        dbClient.document.deleteMany({ where: { studentId: toDelete.id } }),
        dbClient.dormitory.deleteMany({ where: { studentId: toDelete.id } }),
        dbClient.medicalHistory.deleteMany({ where: { studentId: toDelete.id } }),
      ]);

      // Then delete the student
      const deletedStudent = await dbClient?.student?.delete({
        where: { id: toDelete.id },
        include: {
          user: { select: userObjectWithoutPassword },
          class: true,
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
        },
      });

      // Finally delete the associated user
      if (deletedStudent?.user) {
        await dbClient?.user?.delete({
          where: { id: deletedStudent.userId },
        });
      }

      return deletedStudent;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async deleteMany(criteria: StudentCriteriaType, tx?: any): Promise<{ count: number }> {
    try {
      const dbClient = tx ? tx : DbClient;

      const students = await dbClient?.student?.findMany({
        where: criteria,
        select: {
          id: true,
          userId: true,
        },
      });

      if (!students.length) {
        throw new BadRequestError(`No students found to delete`, HttpStatusCodeEnum.NOT_FOUND);
      }

      const studentIds = students.map((student: { id: number }) => student.id);
      const userIds = students.map((student: { userId: number }) => student.userId);

      // Delete all related records and students in a transaction
      const result = await dbClient.$transaction([
        dbClient.guardian.deleteMany({ where: { studentId: { in: studentIds } } }),
        dbClient.document.deleteMany({ where: { studentId: { in: studentIds } } }),
        dbClient.dormitory.deleteMany({ where: { studentId: { in: studentIds } } }),
        dbClient.medicalHistory.deleteMany({ where: { studentId: { in: studentIds } } }),
        dbClient.student.deleteMany({ where: criteria }),
        dbClient.user.deleteMany({ where: { id: { in: userIds } } }),
      ]);

      return { count: result[4].count }; // Return the count of deleted students
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
