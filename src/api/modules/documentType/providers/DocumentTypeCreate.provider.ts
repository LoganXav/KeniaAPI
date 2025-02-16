import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentTypeCreateRequestType } from "../types/DocumentTypeTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DocumentTypeCreateProvider {
  public async create(args: DocumentTypeCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, tenantId } = args;

      const documentType = await dbClient.documentType.create({
        data: {
          name,
          tenantId,
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
