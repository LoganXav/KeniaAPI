import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { ReadUserRecordType, UserWithRelationsAndPermissions } from "~/api/modules/user/types/UserTypes";

export default class UserReadProvider {
  public async getOneByCriteria(criteria: ReadUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelationsAndPermissions | null> {
    try {
      const { userId, email, tenantId } = criteria;

      const result = await dbClient?.user?.findFirst({
        where: {
          ...(userId && { id: Number(userId) }),
          ...(tenantId && { tenantId }),
          ...(email && { email }),
        },
        include: {
          staff: {
            include: {
              subjects: true,
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
          student: true,
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
