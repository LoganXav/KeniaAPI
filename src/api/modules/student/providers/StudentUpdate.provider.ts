import { Prisma, Student } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentUpdateManyRequestType, StudentUpdateRequestType } from "../types/StudentTypes";

export default class StudentUpdateProvider {
  public async updateOne(criteria: StudentUpdateRequestType & { id: number; tenantId: number; guardianIds?: number[] }, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { classId, classDivisionId, guardianIds, id, tenantId, dormitoryId, studentGroupIds } = criteria;

      const updatedStudent = await dbClient?.student?.update({
        where: {
          id,
          tenantId,
        },
        data: {
          ...(classId && { classId: Number(classId) }),
          ...(classDivisionId && { classDivisionId: Number(classDivisionId) }),
          ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
          ...(studentGroupIds && {
            studentGroups: {
              connect: studentGroupIds?.map((id) => ({ id })),
            },
          }),
          ...(guardianIds && {
            guardians: {
              connect: guardianIds?.map((id) => ({ id })),
            },
          }),
        },
        include: {
          user: true,
          class: true,
          classDivision: true,
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
      const { ids, classId, tenantId, dormitoryId, guardianIds } = criteria;

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
          ...(guardianIds && {
            guardians: {
              connect: guardianIds?.map((id) => ({ id })),
            },
          }),
        },
      });

      return updatedStudents;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
