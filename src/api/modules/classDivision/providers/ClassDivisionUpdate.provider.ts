import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { ClassDivisionUpdateRequestType } from "~/api/modules/classDivision/types/ClassDivisionTypes";

@EnforceTenantId
export default class ClassDivisionUpdateProvider {
  public async update(criteria: ClassDivisionUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classId, tenantId, classDivisionTeacherId } = criteria;

      const classDivision = await dbClient.classDivision.update({
        where: { id, tenantId },
        data: {
          ...(name && { name }),
          ...(classId && { classId }),
          ...(classDivisionTeacherId && { classDivisionTeacherId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          class: true,
          students: true,
          classDivisionTeacher: true,
        },
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
