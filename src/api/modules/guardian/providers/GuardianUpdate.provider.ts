import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianUpdateRequestType } from "../types/GuardianTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class GuardianUpdateProvider {
  public async update(args: GuardianUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, firstName, lastName, phoneNumber, email, gender, dateOfBirth, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode, tenantId, studentIds } = args;

      const guardian = await dbClient.guardian.update({
        where: { id: Number(id) },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phoneNumber && { phoneNumber }),
          ...(email && { email }),
          ...(gender && { gender }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(residentialAddress && { residentialAddress }),
          ...(residentialStateId && { residentialStateId }),
          ...(residentialLgaId && { residentialLgaId }),
          ...(residentialCountryId && { residentialCountryId }),
          ...(residentialZipCode && { residentialZipCode }),
          ...(tenantId && { tenantId }),
          ...(studentIds && {
            students: {
              connect: studentIds.map((id) => ({ id })),
            },
          }),
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

  // public async updateMany(args: GuardianUpdateRequestType[], dbClient: PrismaTransactionClient = DbClient) {
  //   try {
  //     const updatedGuardians = [];

  //     for (const guardian of args) {
  //       const existingGuardian = await dbClient.guardian.findFirst({
  //         where: { email: guardian.email, tenantId: guardian.tenantId },
  //       });

  //       const { firstName, lastName, phoneNumber, email, gender, dateOfBirth, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode, tenantId } = guardian;

  //       if (existingGuardian) {
  //         const updatedGuardian = await dbClient.guardian.update({
  //           where: { id: existingGuardian.id },
  //           data: {
  //             ...(firstName && { firstName }),
  //             ...(lastName && { lastName }),
  //             ...(phoneNumber && { phoneNumber }),
  //             ...(email && { email }),
  //             ...(gender && { gender }),
  //             ...(dateOfBirth && { dateOfBirth }),
  //             ...(residentialAddress && { residentialAddress }),
  //             ...(residentialStateId && { residentialStateId }),
  //             ...(residentialLgaId && { residentialLgaId }),
  //             ...(residentialCountryId && { residentialCountryId }),
  //             ...(residentialZipCode && { residentialZipCode }),
  //             ...(tenantId && { tenantId }),
  //           },
  //         });
  //         updatedGuardians.push(updatedGuardian);
  //       } else {
  //         const newGuardian = await dbClient.guardian.create({
  //           data: {
  //             firstName,
  //             lastName,
  //             phoneNumber,
  //             email,
  //             gender,
  //             dateOfBirth,
  //             residentialAddress,
  //             residentialStateId,
  //             residentialLgaId,
  //             residentialCountryId,
  //             residentialZipCode,
  //             tenantId,
  //           },
  //         });
  //         updatedGuardians.push(newGuardian);
  //       }
  //     }

  //     return updatedGuardians;
  //   } catch (error: any) {
  //     throw new InternalServerError(error);
  //   }
  // }
}
