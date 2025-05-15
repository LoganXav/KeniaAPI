import { TermDeleteRequestType } from "~/api/modules/term/types/TermTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TermDeleteProvider {
  public async delete(args: TermDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const term = await dbClient.term.delete({
        where: {
          id,
          tenantId,
        },
        include: {
          breakWeeks: true,
        },
      });

      return term;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
