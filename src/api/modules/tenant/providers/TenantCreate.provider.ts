import DbClient from "~/infrastructure/internal/database";
import { Tenant } from "@prisma/client";
import { CreateTenantData } from "../types/TenantTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class TenantCreateProvider {
  public async createStaff(data: CreateTenantData, tx?: any): Promise<Tenant> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newTenant = await dbClient?.tenant?.create({
        data: {
          data: {
            name: data.name,
            address: data.address,
          },
        },
      });

      return newTenant;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.BAD_REQUEST)
    }
  }
}
