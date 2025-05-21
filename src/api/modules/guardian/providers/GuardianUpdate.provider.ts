import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianUpdateRequestType } from "~/api/modules/guardian/types/GuardianTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class GuardianUpdateProvider {
  public async update(args: GuardianUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, firstName, lastName, phoneNumber, email, gender, dateOfBirth, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode, tenantId, studentIds } = args;

      const guardian = await dbClient.guardian.update({
        where: { id: Number(id), tenantId: Number(tenantId) },
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
}
