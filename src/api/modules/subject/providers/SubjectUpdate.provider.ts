import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { SubjectUpdateRequestType } from "../types/SubjectTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class SubjectUpdateProvider {
  public async update(criteria: SubjectUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId } = criteria;

      const subject = await dbClient.subject.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          class: true,
        },
      });

      return subject;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
