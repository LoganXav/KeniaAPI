import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionDeleteRequestType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class ClassDivisionDeleteProvider {
  public async delete(criteria: ClassDivisionDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = criteria;

      const classDivision = await dbClient.classDivision.delete({
        where: {
          id,
          tenantId,
        },
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
