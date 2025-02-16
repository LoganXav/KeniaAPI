import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentGroupCreateRequestType } from "../types/StudentGroupTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
