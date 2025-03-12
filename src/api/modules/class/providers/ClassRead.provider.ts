import { Class } from "@prisma/client";
import { ClassCriteriaType } from "../types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class ClassReadProvider {
  public async getAllClass(dbClient: PrismaTransactionClient = DbClient): Promise<Class[]> {
    const classes = await dbClient?.class?.findMany();

    return classes;
  }

  public async getByCriteria(criteria: ClassCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, ids, name, classTeacherId, tenantId } = criteria;

      const classes = await dbClient.class.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(name && { name }),
          ...(classTeacherId && { classTeacherId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          classTeacher: {
            include: {
              user: true,
            },
          },
          // students: true,
          subjects: true,
          divisions: true,
        },
      });

      return classes;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassCriteriaType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, classTeacherId, tenantId } = criteria;

      const class_ = await dbClient.class.findFirst({
        where: {
          ...(id && { id }),
          ...(name && { name }),
          ...(classTeacherId && { classTeacherId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          classTeacher: {
            include: {
              user: true,
            },
          },
          // students: true,
          subjects: true,
          divisions: true,
        },
      });

      return class_;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
