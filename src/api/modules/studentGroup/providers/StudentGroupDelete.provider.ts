import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentGroupDeleteRequestType } from "../types/StudentGroupTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StudentGroupDeleteProvider {
  public async delete(args: StudentGroupDeleteRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, tenantId } = args;

      const studentGroup = await dbClient.studentGroup.delete({
        where: {
          id,
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
