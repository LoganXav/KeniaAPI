import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { ClassDivisionCriteriaType } from "~/api/modules/classDivision/types/ClassDivisionTypes";

@EnforceTenantId
export default class ClassDivisionReadProvider {
  public async getByCriteria(criteria: ClassDivisionCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId, classDivisionTeacherId } = criteria;

      const classDivisions = await dbClient.classDivision.findMany({
        where: {
          ...(id && { id }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(classDivisionTeacherId && { classDivisionTeacherId }),
        },
        include: {
          classDivisionTeacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          class: true,
          students: {
            // Example: if you only want each student’s firstName & lastName,
            // you can do the same here. Otherwise, you can leave as `true`.
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return classDivisions;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassDivisionCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId, classDivisionTeacherId } = criteria;

      const classDivision = await dbClient.classDivision.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(classDivisionTeacherId && { classDivisionTeacherId }),
        },
        include: {
          classDivisionTeacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          class: true,
          students: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
