import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianCriteriaType } from "../types/GuardianTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class GuardianReadProvider {
  public async getByCriteria(criteria: GuardianCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, firstName, lastName, phoneNumber, email, tenantId, studentIds } = criteria;

      const guardians = await dbClient.guardian.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(firstName && { firstName: { contains: firstName } }),
          ...(lastName && { lastName: { contains: lastName } }),
          ...(phoneNumber && { phoneNumber: { contains: phoneNumber } }),
          ...(email && { email: { contains: email } }),
          ...(tenantId && { tenantId }),
          ...(studentIds && { students: { some: { id: { in: studentIds } } } }),
        },
        include: {
          students: true,
        },
      });

      return guardians;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: GuardianCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, firstName, lastName, phoneNumber, email, tenantId, studentIds } = criteria;

      const guardian = await dbClient.guardian.findFirst({
        where: {
          ...(id && { id }),
          ...(firstName && { firstName: { contains: firstName } }),
          ...(lastName && { lastName: { contains: lastName } }),
          ...(phoneNumber && { phoneNumber: { contains: phoneNumber } }),
          ...(email && { email: { contains: email } }),
          ...(tenantId && { tenantId }),
          ...(studentIds && { students: { some: { id: { in: studentIds } } } }),
        },
        include: {
          students: true,
        },
      });

      return guardian;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
