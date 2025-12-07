import { Tenant } from "@prisma/client";
import { CreateTenantRecordType } from "../types/TenantTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class TenantCreateProvider {
  public async create(args: CreateTenantRecordType, dbClient: PrismaTransactionClient = DbClient): Promise<Tenant> {
    const { name } = args;
    try {
      const newTenant = await dbClient?.tenant?.create({
        data: {
          name,
          metadata: {
            create: {
              // TODO: The metadata should be updated in a different way. This is prone to errors
              totalStaff: 1,
              totalStudents: 0,
            },
          },
        },
        include: {
          metadata: true,
        },
      });

      return newTenant;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
