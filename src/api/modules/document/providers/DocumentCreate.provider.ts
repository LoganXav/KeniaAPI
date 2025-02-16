import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentCreateRequestType } from "../types/DocumentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class DocumentCreateProvider {
  public async create(args: DocumentCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, url, studentId, documentTypeId, tenantId } = args;

      const document = await dbClient.document.create({
        data: {
          name,
          url,
          ...(studentId && { studentId }),
          documentTypeId,
          tenantId,
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
