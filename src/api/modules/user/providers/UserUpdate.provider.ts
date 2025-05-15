import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { UpdateUserRecordType, UserWithRelations } from "~/api/modules/user/types/UserTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class UserUpdateProvider {
  public async updateOneByCriteria(args: UpdateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<UserWithRelations> {
    const { userId, firstName, gender, lastName, dateOfBirth, phoneNumber, religion, bloodGroup, hasVerified, isFirstTimeLogin, lastLoginDate, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;

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
          ...(religion && { religion }),
          ...(bloodGroup && { bloodGroup }),
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
