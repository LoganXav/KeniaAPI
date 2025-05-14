import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionCreateRequestType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class ClassDivisionCreateProvider {
  public async create(args: ClassDivisionCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, classId, tenantId } = args;

      const classDivision = await dbClient.classDivision.create({
        data: {
          name,
          classId,
          tenantId,
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
