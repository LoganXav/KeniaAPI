import { Class } from "@prisma/client";
import { CreateClassData } from "../types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class ClassCreateProvider {
  public async createClass(data: CreateClassData, dbClient: PrismaTransactionClient = DbClient): Promise<Class> {
    try {
      const newClass = await dbClient?.class?.create({
        data: {
          name: data.name,
          tenantId: data.tenantId,
        },
      });
      return newClass;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
