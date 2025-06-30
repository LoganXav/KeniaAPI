import { Prisma, Student } from "@prisma/client";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentBulkCreateType, StudentCreateType } from "~/api/modules/student/types/StudentTypes";

@EnforceTenantId
export default class StudentCreateProvider {
  public async create(data: StudentCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Student> {
    try {
      const { userId, classId, classDivisionId, tenantId, enrollmentDate, dormitoryId, studentGroupIds, guardianIds } = data;

      const student = await dbClient?.student.create({
        data: {
          userId,
          tenantId,
          enrollmentDate,
          ...(classId !== undefined && { classId }),
          ...(classDivisionId !== undefined && { classDivisionId }),
          ...(dormitoryId !== undefined && { dormitoryId }),
          studentGroups: {
            connect: studentGroupIds?.map((id) => ({ id })),
          },
          guardians: {
            connect: guardianIds?.map((id) => ({ id })),
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

      return student;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async createMany(args: StudentBulkCreateType[], dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    try {
      const student = await dbClient?.student.createMany({
        data: args,
        skipDuplicates: true,
      });

      return student;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
