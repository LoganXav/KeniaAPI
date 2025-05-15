import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { DocumentTypeDeleteRequestType } from "~/api/modules/documentType/types/DocumentTypeTypes";

@EnforceTenantId
export default class DocumentTypeDeleteProvider {
  public async delete(criteria: DocumentTypeDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = criteria;

      const documentType = await dbClient.documentType.delete({
        where: {
          id,
          tenantId,
        },
      });

      return documentType;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
