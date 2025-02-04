import { UpdateUserRecordType, UserWithRelations } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserUpdateProvider {
  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelations> {
    const { userId, firstName, gender, lastName, dateOfBirth, phoneNumber, hasVerified, isFirstTimeLogin, lastLoginDate, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;
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
          ...(hasVerified !== undefined && { hasVerified }),
          ...(isFirstTimeLogin !== undefined && { isFirstTimeLogin }),
          ...(lastLoginDate && { lastLoginDate }),
          ...(residentialAddress && { residentialAddress }),
          ...(residentialStateId && { residentialStateId }),
          ...(residentialLgaId && { residentialLgaId }),
          ...(residentialCountryId && { residentialCountryId }),
          ...(residentialZipCode && { residentialZipCode }),
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
      throw new InternalServerError(error.message);
    }
  }
}
