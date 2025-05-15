import { Group } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { GroupCriteria, UpdateGroupData } from "~/api/modules/group/types/GroupTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class GroupUpdateProvider {
  public async updateOne(criteria: GroupCriteria, updateData: UpdateGroupData, tx?: any): Promise<Group> {
    const dbClient = tx ? tx : DbClient;
    const updatedGroup = await dbClient?.group?.update({
      where: criteria,
      data: updateData,
    });

    return updatedGroup as Promise<Group>;
  }

  public async updateMany(criteria: GroupCriteria, updateData: UpdateGroupData, tx?: any): Promise<Group[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedGroups = await dbClient?.group?.updateMany({
      where: criteria,
      data: updateData,
    });

    return updatedGroups as Promise<Group[]>;
  }
}
