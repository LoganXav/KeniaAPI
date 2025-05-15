import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentGroupUpdateRequestType } from "~/api/modules/studentGroup/types/StudentGroupTypes";

@EnforceTenantId
export default class StudentGroupUpdateProvider {
  public async update(args: StudentGroupUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, tenantId } = args;

      const studentGroup = await dbClient.studentGroup.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(tenantId && { tenantId }),
        },
        include: {
          students: true,
        },
      });

      return studentGroup;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
