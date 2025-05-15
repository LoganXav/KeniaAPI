import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { DocumentTypeCreateRequestType } from "~/api/modules/documentType/types/DocumentTypeTypes";

@EnforceTenantId
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
