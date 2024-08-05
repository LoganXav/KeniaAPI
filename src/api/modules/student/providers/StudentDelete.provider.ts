import DbClient from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { StudentCriteria } from "../types/StudentTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class StudentDeleteProvider {
  public async deleteOne(criteria: StudentCriteria, tx?: any): Promise<Student | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.student?.findFirst({
      where: criteria,
    });
    if (!toDelete) throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedStudent = await dbClient?.student?.delete({
      where: { id: toDelete.id },
    });
    return deletedStudent;
  }

  public async deleteMany(criteria: StudentCriteria, tx?: any): Promise<Student | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedStudent = await dbClient?.student?.deleteMany({
      where: criteria,
    });
    return deletedStudent;
  }
}
