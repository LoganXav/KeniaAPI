import DbClient from "~/infrastructure/internal/database";
import { Tenant } from "@prisma/client";
import { TenantCriteria } from "../types/TenantTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class StaffDeleteProvider {
  public async deleteOne(criteria: TenantCriteria, tx?: any): Promise<Tenant | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.tenant?.findFirst({
      where: criteria,
    });
    if(!toDelete) 
      throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
    
    const deletedTenant = await dbClient?.tenant?.delete({
        where: {id: toDelete.id},
    });
    return deletedTenant;
  }

  public async deleteMany(criteria: TenantCriteria, tx?: any): Promise<Tenant | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedTenant = await dbClient?.tenant?.deleteMany({
        where: criteria,
    });
    return deletedTenant;
  }
}
