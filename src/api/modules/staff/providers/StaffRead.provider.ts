import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria } from "../types/StaffTypes";

export default class StaffReadProvider {
  public async getAllStaff(tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const staffs = await dbClient?.staff?.findMany();

    return staffs;
  }

  public async getByCriteria(criteria: StaffCriteria, tx?: any): Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const { departmentId, roleListId, ...restCriteria } = criteria;
    const staffs = await dbClient?.staff?.findMany({
      where: {
        ...restCriteria,
        ...(departmentId && {
          department: {
            some: {
              id: departmentId,
            },
          },
        }),
        ...(roleListId && {
          roleListId: roleListId,
        }),
      },
    });

    return staffs;
  }

  public async getOneByCriteria(criteria: StaffCriteria, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const staff = await dbClient?.staff?.findFirst({
      where: criteria,
    });

    return staff;
  }
}
