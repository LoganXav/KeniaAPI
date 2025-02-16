import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentTypeCriteriaType } from "../types/DocumentTypeTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DocumentTypeReadProvider {
  public async getByCriteria(criteria: DocumentTypeCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, tenantId } = criteria;

      const documentTypes = await dbClient.documentType.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          document: true,
        },
      });

      return documentTypes;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: DocumentTypeCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = criteria;

      const documentType = await dbClient.documentType.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name: { contains: name } }),
          ...(tenantId && { tenantId }),
        },
        include: {
          document: true,
        },
      });

      return documentType;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
