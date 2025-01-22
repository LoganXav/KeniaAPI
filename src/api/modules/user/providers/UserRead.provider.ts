import { Role, Staff, Student, User } from "@prisma/client";
import { ReadUserRecordType, UserWithRelations } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserReadProvider {
  public async getOneByCriteria(criteria: ReadUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelations | null> {
    try {
      const { id, email } = criteria;
      const result = await dbClient?.user?.findFirst({
        where: {
          ...(id && { id }),
          ...(email && { email }),
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
