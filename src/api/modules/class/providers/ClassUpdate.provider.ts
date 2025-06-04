import { Class } from "@prisma/client";
import { ClassUpdateRequestType } from "~/api/modules/class/types/ClassTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class ClassUpdateProvider {
  public async updateOne(args: ClassUpdateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Class> {
    const updatedClass = await dbClient?.class?.update({
      where: { id: args.id, tenantId: args.tenantId },
      data: {
        ...(args.name && { name: args.name }),
      },
      include: {
        students: true,
        subjects: true,
        divisions: true,
      },
    });

    return updatedClass;
  }
}
