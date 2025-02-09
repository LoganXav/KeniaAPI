import DbClient from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { StudentCriteriaType } from "../types/StudentTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentDeleteProvider {
  public async deleteOne(criteria: StudentCriteriaType, tx?: any): Promise<Student | null> {
    try {
      const dbClient = tx ? tx : DbClient;
      const toDelete = await dbClient?.student?.findFirst({
        where: criteria,
      });

      if (!toDelete) {
        throw new BadRequestError(`Student ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
      }

      const deletedStudent = await dbClient?.student?.delete({
        where: { id: toDelete.id },
        include: {
          user: true,
          class: true,
        },
      });

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

      // First get all students matching criteria
      const students = await dbClient?.student?.findMany({
        where: criteria,
        select: { userId: true },
      });

      if (!students.length) {
        throw new BadRequestError(`No students found to delete`, HttpStatusCodeEnum.NOT_FOUND);
      }

      const userIds = students.map((student: { userId: any }) => student.userId);

      // Delete students and their associated users in a transaction
      const result = await dbClient.$transaction([
        dbClient.student.deleteMany({ where: criteria }),
        dbClient.user.deleteMany({
          where: {
            id: { in: userIds },
          },
        }),
      ]);

      return { count: result[0].count };
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
