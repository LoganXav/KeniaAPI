import { User } from "@prisma/client";
import { ReadUserRecordType } from "~/api/shared/types/UserInternalApiTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserReadProvider {
  public async getOneByCriteria(criteria: ReadUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User | null> {
    try {
      const { email } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(email && { email }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
