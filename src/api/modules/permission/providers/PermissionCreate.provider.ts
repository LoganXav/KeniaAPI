import DbClient from "~/infrastructure/internal/database";
import { Permission } from "@prisma/client";
import { CreatePermissionData } from "../types/PermissionTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class PermissionCreateProvider {
  public async createPermission(data: CreatePermissionData, tx?: any): Promise<Permission> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newPermission = await dbClient?.permission?.create({
        data: {
          name: data.name,
          tenantId: data.tenantId
        },
      });

      return newPermission;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND)
    }
  }
}
