import { User } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { UserDbCriteria } from "~/api/shared/types/UserInternalApiTypes";

export default class UserReadProvider {
  public async getOneByCriteria(criteria: UserDbCriteria, tx = DbClient): Promise<User | null> {
    try {
      const dbClient = tx;
      const { email } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(email && { email: email }),
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findUserById(criteria: UserDbCriteria, tx = DbClient): Promise<User | null> {
    try {
      const dbClient = tx;
      const { id } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(id && { id: id }),
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
