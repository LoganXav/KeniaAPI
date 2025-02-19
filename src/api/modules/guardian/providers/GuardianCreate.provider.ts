import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { GuardianCreateRequestType } from "../types/GuardianTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class GuardianCreateProvider {
  public async create(args: GuardianCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, phone, email, address, tenantId, studentIds } = args;

      const guardian = await dbClient.guardian.create({
        data: {
          name,
          phone,
          email,
          address,
          tenantId,
          students: {
            connect: studentIds?.map((id) => ({ id })),
          },
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
