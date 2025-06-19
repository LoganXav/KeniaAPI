import { Class } from "@prisma/client";
import { ClassCriteriaType } from "~/api/modules/class/types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class ClassReadProvider {
  public async getAllClass(dbClient: PrismaTransactionClient = DbClient): Promise<Class[]> {
    const classes = await dbClient?.class?.findMany({
      include: {
        subjects: true,
        divisions: true,
      },
    });

    return classes;
  }

  public async getByCriteria(criteria: ClassCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, tenantId, withoutGradingStructures } = criteria;

      const classes = await dbClient.class.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name }),
          ...(tenantId && { tenantId }),
          ...(withoutGradingStructures && { gradingStructures: { none: {} } }),
        },
        include: {
          subjects: true,
          divisions: true,
        },
      });

      return classes;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = criteria;

      const class_ = await dbClient.class.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name }),
          ...(tenantId && { tenantId }),
        },
        include: {
          subjects: true,
          divisions: true,
        },
      });

      return class_;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
