import { SubjectCreateRequestType } from "~/api/modules/subject/types/SubjectTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class SubjectCreateProvider {
  public async create(args: SubjectCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, description, classId, tenantId, staffIds } = args;

      const subject = await dbClient.subject.create({
        data: {
          name,
          description,
          classId,
          tenantId,
          staffs: {
            connect: staffIds?.map((id) => ({ id })),
          },
        },
        include: {
          class: true,
          staffs: true,
        },
      });
      return subject;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
