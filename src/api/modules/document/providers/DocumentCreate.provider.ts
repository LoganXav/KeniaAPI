import { DocumentCreateRequestType } from "~/api/modules/document/types/DocumentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
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
