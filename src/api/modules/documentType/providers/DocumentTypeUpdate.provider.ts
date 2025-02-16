import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentTypeUpdateRequestType } from "../types/DocumentTypeTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DocumentTypeUpdateProvider {
  public async update(criteria: DocumentTypeUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = criteria;

      const documentType = await dbClient.documentType.update({
        where: { id },
        data: {
          ...(name && { name }),
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
