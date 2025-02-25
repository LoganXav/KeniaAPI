import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ClassDivisionCreateRequestType } from "../types/ClassDivisionTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class ClassDivisionCreateProvider {
  public async create(args: ClassDivisionCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, classId, subjectIds, tenantId } = args;

      const classDivision = await dbClient.classDivision.create({
        data: {
          name,
          classId,
          tenantId,
          subjects: {
            connect: subjectIds.map((id) => ({ id })),
          },
        },
        include: {
          class: true,
          subjects: true,
          students: true,
        },
      });
      return classDivision;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
