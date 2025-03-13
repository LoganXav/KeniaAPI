import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TermDeleteRequestType } from "../types/TermTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TermDeleteProvider {
  public async delete(args: TermDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const term = await dbClient.term.delete({
        where: {
          id,
          tenantId,
        },
        include: {
          breakWeeks: true,
        },
      });

      return term;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
