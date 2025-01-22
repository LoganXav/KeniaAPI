import { User } from "@prisma/client";
import { UpdateUserRecordType } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserUpdateProvider {
  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<Omit<User, "password">> {
    const { userId, firstName, gender, lastName, dateOfBirth, phoneNumber, email, hasVerified, isFirstTimeLogin, lastLoginDate, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;
    try {
      const result = await dbClient?.user?.update({
        where: {
          id: userId,
        },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(gender && { gender }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(phoneNumber && { phoneNumber }),
          ...(email && { email }),
          ...(hasVerified !== undefined && { hasVerified }),
          ...(isFirstTimeLogin !== undefined && { isFirstTimeLogin }),
          ...(lastLoginDate && { lastLoginDate }),
          ...(residentialAddress && { residentialAddress }),
          ...(residentialStateId && { residentialStateId }),
          ...(residentialLgaId && { residentialLgaId }),
          ...(residentialCountryId && { residentialCountryId }),
          ...(residentialZipCode && { residentialZipCode: residentialZipCode.toString() }),
        },
      });

      const { password, ...res } = result;

      return res;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
