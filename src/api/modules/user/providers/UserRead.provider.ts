import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ReadUserRecordType, UserWithRelations } from "~/api/modules/user/types/UserTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserReadProvider {
  public async getAll(dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelations[]> {
    try {
      const users = await dbClient.user.findMany({
        include: {
          staff: {
            include: {
              role: true,
            },
          },
          student: true,
        },
      });

      return users;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ReadUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelations | null> {
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
