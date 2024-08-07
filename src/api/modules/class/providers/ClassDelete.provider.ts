import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassCriteria } from "../types/ClassTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class ClassDeleteProvider {
  public async deleteOne(criteria: ClassCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Class | any> {
    const toDelete = await dbClient?.class?.findFirst({
      where: criteria,
    });
    if (!toDelete) throw new BadRequestError(`Class ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedClass = await dbClient?.class?.delete({
      where: { id: toDelete.id },
    });
    return deletedClass;
  }

  public async deleteMany(criteria: ClassCriteria, dbClient: PrismaTransactionClient = DbClient): Promise<Class | any> {
    const deletedClass = await dbClient?.class?.deleteMany({
      where: criteria,
    });
    return deletedClass;
  }
}
