import DbClient from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { CreateClassData } from "../types/ClassTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class ClassCreateProvider {
  public async createClass(data: CreateClassData, tx?: any): Promise<Class> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newClass = await dbClient?.class?.create({
        data: {
          name: data.name,
          tenantId: data.tenantId
        },
      });

      return newClass;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND)
    }
  }
}
