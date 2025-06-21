import { ClassPromotionCreateRequestType } from "../types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class ClassPromotionCreateProvider {
  public async create(args: ClassPromotionCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { studentId, fromClassId, toClassId, calendarId, tenantId, promotionStatus = "Awaiting", comments } = args;

      const classPromotion = await dbClient.classPromotion.create({
        data: {
          studentId,
          fromClassId,
          toClassId,
          calendarId,
          tenantId,
          promotionStatus,
          comments,
        },
        include: {
          student: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          fromClass: true,
          toClass: true,
          calendar: true,
        },
      });

      return classPromotion;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
