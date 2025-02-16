import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentTypeDeleteRequestType } from "../types/DocumentTypeTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
