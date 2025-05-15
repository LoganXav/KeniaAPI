import { Group } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { GroupCriteria } from "~/api/modules/group/types/GroupTypes";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class GroupDeleteProvider {
  public async deleteOne(criteria: GroupCriteria, tx?: any): Promise<Group | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.group?.findFirst({
      where: criteria,
    });
    if (!toDelete) throw new BadRequestError(`Group ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);

    const deletedGroup = await dbClient?.group?.delete({
      where: { id: toDelete.id },
    });
    return deletedGroup;
  }

  public async deleteMany(criteria: GroupCriteria, tx?: any): Promise<Group | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedGroup = await dbClient?.group?.deleteMany({
      where: criteria,
    });
    return deletedGroup;
  }
}
