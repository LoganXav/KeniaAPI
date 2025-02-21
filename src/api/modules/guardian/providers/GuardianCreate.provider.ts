import { GuardianCreateRequestType } from "../types/GuardianTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class GuardianCreateProvider {
  public async create(args: GuardianCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { firstName, lastName, phoneNumber, email, gender, dateOfBirth, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode, tenantId, studentIds } = args;

      const guardian = await dbClient.guardian.create({
        data: {
          firstName,
          lastName,
          phoneNumber,
          email,
          gender,
          dateOfBirth,
          residentialAddress,
          residentialStateId,
          residentialLgaId,
          residentialCountryId,
          residentialZipCode,
          tenantId,
          students: {
            connect: studentIds?.map((id) => ({ id })),
          },
        },
        include: {
          students: true,
        },
      });
      return guardian;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async createMany(args: GuardianCreateRequestType[], dbClient: PrismaTransactionClient = DbClient) {
    try {
      const data = args.map((guardian) => ({
        tenantId: guardian.tenantId,
        email: guardian.email,
        gender: guardian.gender,
        lastName: guardian.lastName,
        firstName: guardian.firstName,
        phoneNumber: guardian.phoneNumber,
        dateOfBirth: guardian.dateOfBirth,
        residentialLgaId: guardian.residentialLgaId,
        residentialAddress: guardian.residentialAddress,
        residentialStateId: guardian.residentialStateId,
        residentialZipCode: guardian.residentialZipCode,
        residentialCountryId: guardian.residentialCountryId,
      }));

      await dbClient.guardian.createMany({
        data,
        skipDuplicates: true,
      });

      const createdGuardians = await dbClient.guardian.findMany({
        where: {
          email: { in: args.map((guardian) => guardian.email) },
          tenantId: args[0].tenantId,
        },
        select: { id: true },
      });

      return createdGuardians;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
