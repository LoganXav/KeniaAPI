import { TermCreateRequestType } from "~/api/modules/term/types/TermTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TermCreateProvider {
  public async createOrUpdate(args: TermCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, startDate, endDate, calendarId, tenantId } = args;

      const term = await dbClient.term.upsert({
        where: { id: id || 0 },
        update: {
          name,
          startDate,
          endDate,
          calendarId,
          tenantId,
        },
        create: {
          name,
          startDate,
          endDate,
          calendarId,
          tenantId,
        },
      });
      return term;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
