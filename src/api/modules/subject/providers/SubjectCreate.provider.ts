import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { SubjectCreateRequestType } from "../types/SubjectTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class SubjectCreateProvider {
  public async create(args: SubjectCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, classId, tenantId, staffIds } = args;

      const subject = await dbClient.subject.create({
        data: {
          name,
          classId,
          tenantId,
          staffs: {
            connect: staffIds?.map((id) => ({ id })),
          },
        },
        include: {
          class: true,
        },
      });
      return subject;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
