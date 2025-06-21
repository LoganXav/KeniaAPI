import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { ClassPromotionCriteriaType, ClassPromotionReadOneCriteriaType } from "~/api/modules/class/types/ClassTypes";

@EnforceTenantId
export default class ClassPromotionReadProvider {
  public async getByCriteria(criteria: ClassPromotionCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { calendarId, classId, classDivisionId, tenantId } = criteria;

      const promotions = await dbClient.classPromotion.findMany({
        where: {
          ...(calendarId && { calendarId }),
          ...(classId && { fromClassId: classId }),
          ...(tenantId && { tenantId }),
          ...(classDivisionId && {
            student: {
              classDivisionId,
            },
          }),
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          fromClass: {
            select: {
              id: true,
              name: true,
            },
          },
          toClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return promotions;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassPromotionReadOneCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { studentId, calendarId, tenantId } = criteria;

      const promotion = await dbClient.classPromotion.findUnique({
        where: {
          studentId_calendarId_tenantId: {
            studentId,
            calendarId,
            tenantId,
          },
        },
        include: {
          student: {
            include: {
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

      return promotion;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
