import { DocumentCriteriaType } from "~/api/modules/document/types/DocumentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
@EnforceTenantId
export default class DocumentReadProvider {
  public async getByCriteria(criteria: DocumentCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, studentId, documentTypeId, tenantId } = criteria;

      const documents = await dbClient.document.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(studentId && { studentId }),
          ...(documentTypeId && { documentTypeId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          documentType: true,
        },
      });

      return documents;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: DocumentCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, studentId, documentTypeId, tenantId } = criteria;

      const document = await dbClient.document.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
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
