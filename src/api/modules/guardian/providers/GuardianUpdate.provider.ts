import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianUpdateRequestType } from "../types/GuardianTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class GuardianUpdateProvider {
  public async update(args: GuardianUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, phone, email, address, tenantId, studentIds } = args;

      const guardian = await dbClient.guardian.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(email && { email }),
          ...(address && { address }),
          ...(tenantId && { tenantId }),
          ...(studentIds && {
            students: {
              connect: studentIds.map((id) => ({ id })),
            },
          }),
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
