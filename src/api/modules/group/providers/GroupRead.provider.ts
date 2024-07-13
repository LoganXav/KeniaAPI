import DbClient from "~/infrastructure/internal/database";
import { Group } from "@prisma/client";
import { GroupCriteria } from "../types/GroupTypes";

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
