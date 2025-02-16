import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { DocumentUpdateRequestType } from "../types/DocumentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
