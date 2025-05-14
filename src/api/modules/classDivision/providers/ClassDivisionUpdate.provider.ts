import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionCriteriaType, ClassDivisionUpdateRequestType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class ClassDivisionUpdateProvider {
  public async update(criteria: ClassDivisionUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId } = criteria;

      const classDivision = await dbClient.classDivision.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          class: true,
          students: true,
        },
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
