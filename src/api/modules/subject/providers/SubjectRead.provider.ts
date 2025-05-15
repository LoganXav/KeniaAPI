import { SubjectCriteriaType } from "~/api/modules/subject/types/SubjectTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
@EnforceTenantId
export default class SubjectReadProvider {
  public async getByCriteria(criteria: SubjectCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, classId, tenantId, staffIds } = criteria;

      const subjects = await dbClient.subject.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name: { contains: name } }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(staffIds && { staffs: { some: { id: { in: staffIds } } } }),
        },
        include: {
          class: true,
          staffs: true,
        },
      });

      return subjects;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: SubjectCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId, staffIds } = criteria;

      const subject = await dbClient.subject.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(staffIds && { staffs: { some: { id: { in: staffIds } } } }),
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
