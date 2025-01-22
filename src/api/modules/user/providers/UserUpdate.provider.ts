import { User } from "@prisma/client";
import { UpdateUserRecordType } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserUpdateProvider {
  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { userId, firstName, lastName, dateOfBirth, phoneNumber, email, hasVerified, isFirstTimeLogin, lastLoginDate, residentialAddress, residentialCity, residentialState, residentialCountry, residentialZipCode } = args;
    try {
      const result = await dbClient?.user?.update({
        where: {
          id: userId,
        },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(phoneNumber && { phoneNumber }),
          ...(email && { email }),
          ...(hasVerified !== undefined && { hasVerified }),
          ...(isFirstTimeLogin !== undefined && { isFirstTimeLogin }),
          ...(lastLoginDate && { lastLoginDate }),
          ...(residentialAddress && { residentialAddress }),
          ...(residentialCity && { residentialCity }),
          ...(residentialState && { residentialState }),
          ...(residentialCountry && { residentialCountry }),
          ...(residentialZipCode && { residentialZipCode }),
        },
      });

      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
