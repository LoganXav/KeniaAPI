import { User } from "@prisma/client";
import { UserDbCriteria } from "~/api/shared/types/UserInternalApiTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";

export default class UserReadProvider {
  public async getOneByCriteria(criteria: UserDbCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<User | null> {
    try {
      const { email } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(email && { email }),
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
