import { DocumentUpdateRequestType } from "~/api/modules/document/types/DocumentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class DocumentUpdateProvider {
  public async update(criteria: DocumentUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, url, studentId, documentTypeId, tenantId } = criteria;

      const document = await dbClient.document.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(url && { url }),
          ...(studentId && { studentId }),
          ...(documentTypeId && { documentTypeId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          documentType: true,
        },
      });

      return document;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
