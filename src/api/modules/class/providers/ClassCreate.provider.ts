import { ClassCreateRequestType } from "~/api/modules/class/types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class ClassCreateProvider {
  public async create(args: ClassCreateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { name, tenantId } = args;

      const classRecord = await dbClient.class.create({
        data: {
          name,
          tenantId,
        },
        include: {
          students: true,
          subjects: true,
          divisions: true,
        },
      });

      return classRecord;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async createMany(args: ClassCreateRequestType[], dbClient: PrismaTransactionClient = DbClient) {
    try {
      const data = args.map(({ name, tenantId }) => ({
        name,
        tenantId,
      }));

      const classRecords = await dbClient.class.createMany({
        data,
        skipDuplicates: true,
      });

      return classRecords;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
