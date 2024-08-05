import DbClient from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassCriteria } from "../types/ClassTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class ClassDeleteProvider {
  public async deleteOne(criteria: ClassCriteria, tx?: any): Promise<Class | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.class?.findFirst({
      where: criteria,
    });
    if (!toDelete) throw new BadRequestError(`Class ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedClass = await dbClient?.class?.delete({
      where: { id: toDelete.id },
    });
    return deletedClass;
  }

  public async deleteMany(criteria: ClassCriteria, tx?: any): Promise<Class | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedClass = await dbClient?.class?.deleteMany({
      where: criteria,
    });
    return deletedClass;
  }
}
