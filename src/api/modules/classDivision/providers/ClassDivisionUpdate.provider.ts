import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionCriteriaType, ClassDivisionUpdateRequestType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
      });

      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
