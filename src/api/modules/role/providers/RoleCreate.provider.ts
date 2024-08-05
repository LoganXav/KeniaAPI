import DbClient from "~/infrastructure/internal/database";
import { Role } from "@prisma/client";
import { CreateRoleData } from "../types/RoleTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class RoleCreateProvider {
  public async createRole(data: CreateRoleData, tx?: any): Promise<Role> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newRole = await dbClient?.role?.create({
        data: {
          name: data.name,
          tenantId: data.tenantId,
        },
      });

      return newRole;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND);
    }
  }
}
