import DbClient from "~/infrastructure/internal/database";
import { Group } from "@prisma/client";
import { CreateGroupData } from "../types/GroupTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class GroupCreateProvider {
  public async createGroup(data: CreateGroupData, tx?: any): Promise<Group> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newGroup = await dbClient?.group?.create({
        data: {
          name: data.name,
          tenantId: data.tenantId,
        },
      });

      return newGroup;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND);
    }
  }
}
