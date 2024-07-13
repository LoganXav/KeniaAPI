import DbClient from "~/infrastructure/internal/database";
import { Role } from "@prisma/client";
import { RoleCriteria } from "../types/RoleTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class RoleDeleteProvider {
  public async deleteOne(criteria: RoleCriteria, tx?: any): Promise<Role | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.role?.findFirst({
      where: criteria,
    });
    if(!toDelete) 
      throw new BadRequestError(`Role ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
    
    const deletedRole = await dbClient?.role?.delete({
        where: {id: toDelete.id},
    });
    return deletedRole;
  }

  public async deleteMany(criteria: RoleCriteria, tx?: any): Promise<Role | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedRole = await dbClient?.role?.deleteMany({
        where: criteria,
    });
    return deletedRole;
  }
}
