import { Prisma, Staff, User } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { CreateBulkUserRecordType, CreateUserRecordType } from "~/api/modules/user/types/UserTypes";

export default class UserCreateProvider {
  public async create(args: CreateUserRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<User & { staff: Staff | null }> {
    const { tenantId, firstName, gender, bloodGroup, religion, dateOfBirth, lastName, password, phoneNumber, email, userType, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;

    try {
      const newUser = await dbClient?.user?.create({
        data: {
          tenantId,
          email,
          firstName,
          lastName,
          gender,
          bloodGroup,
          religion,
          dateOfBirth,
          password,
          phoneNumber,
          userType,
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

      return newUser;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async createMany(args: CreateBulkUserRecordType[], dbClient: PrismaTransactionClient = DbClient): Promise<Prisma.BatchPayload> {
    try {
      const newUser = await dbClient.user.createMany({
        data: args,
        skipDuplicates: true,
      });

      return newUser;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
