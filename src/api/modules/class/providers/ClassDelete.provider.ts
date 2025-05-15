import { Class } from "@prisma/client";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { ClassDeleteRequestType } from "~/api/modules/class/types/ClassTypes";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
@EnforceTenantId
export default class ClassDeleteProvider {
  public async deleteOne(args: ClassDeleteRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Class | any> {
    const toDelete = await dbClient?.class?.findFirst({
      where: { id: args.id },
    });
    if (!toDelete) throw new BadRequestError(`Class ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedClass = await dbClient?.class?.delete({
      where: { id: toDelete.id },
    });

    return deletedClass;
  }
}
