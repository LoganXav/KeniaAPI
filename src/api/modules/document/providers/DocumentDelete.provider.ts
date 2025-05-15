import { DocumentDeleteRequestType } from "~/api/modules/document/types/DocumentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
@EnforceTenantId
export default class DocumentDeleteProvider {
  public async delete(criteria: DocumentDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = criteria;

      const document = await dbClient.document.delete({
        where: {
          id,
          tenantId,
        },
      });

      return document;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
