import { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassCreateRequestType } from "../types/ClassTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import DbClient from "~/infrastructure/internal/database";

export default class ClassCreateProvider {
  public async create(args: ClassCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, type, classTeacherId, tenantId } = args;

      const classRecord = await dbClient.class.create({
        data: {
          name,
          type,
          classTeacherId,
          tenantId,
        },
        include: {
          classTeacher: true,
          students: true,
          subjects: true,
          divisions: true,
        },
      });

      return classRecord;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
