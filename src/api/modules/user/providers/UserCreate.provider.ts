import { User } from "@prisma/client";
import { CreateUserRecordType } from "~/api/modules/user/types/UserTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class UserCreateProvider {
  public async create(args: CreateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User> {
    const { tenantId, firstName, lastName, password, phoneNumber, email, userType, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;

    try {
      const newUser = await dbClient?.user?.create({
        data: {
          tenantId,
          email,
          firstName,
          lastName,
          password,
          phoneNumber,
          userType,
          residentialAddress,
          residentialStateId,
          residentialLgaId,
          residentialCountryId,
          residentialZipCode,
        },
      });

      return newUser;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
