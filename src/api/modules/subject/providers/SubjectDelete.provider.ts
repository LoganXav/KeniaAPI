import { SubjectDeleteRequestType } from "../types/SubjectTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class SubjectDeleteProvider {
  public async delete(criteria: SubjectDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = criteria;

      const subject = await dbClient.subject.delete({
        where: {
          id,
          tenantId,
        },
      });

      return subject;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
