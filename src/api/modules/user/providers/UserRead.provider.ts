import { ReadUserRecordType, UserWithRelations } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
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
      const { id, email, tenantId, jobTitle, roleId } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(tenantId && { tenantId }),
          ...(email && { email }),
          ...(jobTitle || roleId
            ? {
                staff: {
                  ...(jobTitle && { jobTitle }),
                  ...(roleId && { roleId }),
                },
              }
            : {}),
        },
        include: {
          staff: {
            include: {
              role: true,
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
