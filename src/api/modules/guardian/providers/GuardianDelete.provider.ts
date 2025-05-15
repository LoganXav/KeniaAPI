import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianDeleteRequestType } from "~/api/modules/guardian/types/GuardianTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class GuardianDeleteProvider {
  public async delete(args: GuardianDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const guardian = await dbClient.guardian.delete({
        where: {
          id,
          tenantId,
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
