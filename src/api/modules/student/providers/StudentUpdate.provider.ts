import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Prisma, Student } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentUpdateManyRequestType, StudentUpdateRequestType } from "../types/StudentTypes";

export default class StudentUpdateProvider {
  public async updateOne(criteria: StudentUpdateRequestType & { id: number; tenantId: number }, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { classId, admissionNo, religion, bloodGroup, id, tenantId, dormitoryId, studentGroupIds } = criteria;

      const numericId = Number(id);

      const updatedStudent = await dbClient?.student?.update({
        where: {
          userId: numericId,
          tenantId,
        },
        data: {
          ...(classId && { classId: Number(classId) }),
          ...(admissionNo && { admissionNo }),
          ...(religion && { religion }),
          ...(bloodGroup && { bloodGroup }),
          ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
          ...(studentGroupIds && {
            studentGroups: {
              connect: studentGroupIds?.map((id) => ({ id })),
            },
          }),
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

      if (updatedStudent.user) {
        delete (updatedStudent.user as any).password;
      }

      return updatedStudent;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateMany(criteria: StudentUpdateManyRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    try {
      const { ids, classId, tenantId, dormitoryId } = criteria;

      const updatedStudents = await dbClient?.student?.updateMany({
        where: {
          id: {
            in: ids,
          },
          tenantId,
        },
        data: {
          ...(classId && { classId: Number(classId) }),
          ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
        },
      });

      return updatedStudents;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
