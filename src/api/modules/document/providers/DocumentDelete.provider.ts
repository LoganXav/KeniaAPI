import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentDeleteRequestType } from "../types/DocumentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
