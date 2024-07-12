import DbClient from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassCriteria } from "../types/ClassTypes";

export default class ClassReadProvider {
  public async getAllClass(tx?: any): Promise<Class[]> {
    const dbClient = tx ? tx : DbClient;
    const classes = await dbClient?.class?.findMany();

    return classes;
  }

  public async getByCriteria(criteria: ClassCriteria, tx?: any): Promise<Class[]> {
    const dbClient = tx ? tx : DbClient;
    const classes = await dbClient?.class?.findMany({
      where: criteria,
    });

    return classes;
  }

  public async getOneByCriteria(criteria: ClassCriteria, tx?: any): Promise<Class> {
    const dbClient = tx ? tx : DbClient;
    const clasx = await dbClient?.class?.findFirst({
      where: criteria,
    });

    return clasx;
  }
}
