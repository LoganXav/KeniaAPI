import { Prisma, Student } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentUpdateManyRequestType, StudentUpdateRequestType } from "~/api/modules/student/types/StudentTypes";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";

@EnforceTenantId
export default class StudentUpdateProvider {
  public async updateOne(criteria: Partial<StudentUpdateRequestType> & { id: number; tenantId: number; guardianIds?: number[] }, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { classId, classDivisionId, guardianIds, id, tenantId, dormitoryId, studentGroupIds } = criteria;

      const updatedStudent = await dbClient?.student?.update({
        where: { id, tenantId },
        data: {
          ...(classId && { class: { connect: { id: Number(classId) } } }),
          ...(classDivisionId && { classDivision: { connect: { id: Number(classDivisionId) } } }),
          ...(dormitoryId && { dormitory: { connect: { id: Number(dormitoryId) } } }),
          ...(studentGroupIds && {
            studentGroups: {
              set: studentGroupIds.map((id) => ({ id })),
            },
          }),
          guardians: {
            set: guardianIds?.map((id) => ({ id })) || [],
          },
        },
        include: {
          user: { select: userObjectWithoutPassword },
          class: true,
          classDivision: true,
          guardians: true,
          documents: true,
          dormitory: true,
          medicalHistory: true,
          studentGroups: true,
        },
      });

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
