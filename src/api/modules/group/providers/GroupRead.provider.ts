import { Group } from "@prisma/client";
import DbClient from "~/infrastructure/internal/database";
import { GroupCriteria } from "~/api/modules/group/types/GroupTypes";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";

@EnforceTenantId
export default class GroupReadProvider {
  public async getAllGroup(tx?: any): Promise<Group[]> {
    const dbClient = tx ? tx : DbClient;
    const groups = await dbClient?.group?.findMany();

    return groups;
  }

  public async getByCriteria(criteria: GroupCriteria, tx?: any): Promise<Group[]> {
    const dbClient = tx ? tx : DbClient;
    const groups = await dbClient?.group?.findMany({
      where: criteria,
    });

    return groups;
  }

  public async getOneByCriteria(criteria: GroupCriteria, tx?: any): Promise<Group> {
    const dbClient = tx ? tx : DbClient;
    const group = await dbClient?.group?.findFirst({
      where: criteria,
    });

    return group;
  }
}
