import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentGroupCreateRequestType } from "~/api/modules/studentGroup/types/StudentGroupTypes";

@EnforceTenantId
export default class StudentGroupCreateProvider {
  public async create(args: StudentGroupCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, tenantId } = args;

      const studentGroup = await dbClient.studentGroup.create({
        data: {
          name,
          tenantId,
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
