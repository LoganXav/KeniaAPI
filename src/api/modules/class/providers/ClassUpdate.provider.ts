import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassCriteria, UpdateClassData } from "../types/ClassTypes";

export default class ClassUpdateProvider {
  public async updateOne(criteria: ClassCriteria, updateData: UpdateClassData, dbClient: PrismaTransactionClient = DbClient): Promise<Class> {
    const updatedClass = await dbClient?.class?.update({
      where: criteria,
      data: updateData,
    });

    return updatedClass as Promise<Class>;
  }

  public async updateMany(criteria: ClassCriteria, updateData: UpdateClassData, dbClient: PrismaTransactionClient = DbClient): Promise<Class[]> {
    const updatedClasss = await dbClient?.class?.updateMany({
      where: criteria,
      data: updateData,
    });

    return updatedClasss as Promise<Class[]>;
  }
}
