import { ClassCreateRequestType } from "../types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class ClassCreateProvider {
  public async create(args: ClassCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { type, tenantId } = args;

      const classRecord = await dbClient.class.create({
        data: {
          type,
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

  public async createMany(args: ClassCreateRequestType[], dbClient: PrismaTransactionClient = DbClient) {
    try {
      const data = args.map(({ type, tenantId }) => ({
        type,
        tenantId,
      }));

      const classRecords = await dbClient.class.createMany({
        data,
        skipDuplicates: true,
      });

      return classRecords;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
