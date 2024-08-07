import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassCriteria } from "../types/ClassTypes";

export default class ClassReadProvider {
  public async getAllClass(dbClient: PrismaTransactionClient = DbClient): Promise<Class[]> {
    const classes = await dbClient?.class?.findMany();

    return classes;
  }

  public async getByCriteria(criteria: ClassCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Class[]> {
    const classes = await dbClient?.class?.findMany({
      where: criteria,
    });

    return classes;
  }

  public async getOneByCriteria(criteria: ClassCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Class> {
    const clasx = await dbClient?.class?.findFirst({
      where: criteria,
    });

    return clasx;
  }
}
