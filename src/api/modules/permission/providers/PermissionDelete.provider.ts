import DbClient from "~/infrastructure/internal/database";
import { Permission } from "@prisma/client";
import { PermissionCriteria } from "../types/PermissionTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class PermissionDeleteProvider {
  public async deleteOne(criteria: PermissionCriteria, tx?: any): Promise<Permission | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.permission?.findFirst({
      where: criteria,
    });
    if (!toDelete) throw new BadRequestError(`Permission ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedPermission = await dbClient?.permission?.delete({
      where: { id: toDelete.id },
    });
    return deletedPermission;
  }

  public async deleteMany(criteria: PermissionCriteria, tx?: any): Promise<Permission | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedPermission = await dbClient?.permission?.deleteMany({
      where: criteria,
    });
    return deletedPermission;
  }
}
