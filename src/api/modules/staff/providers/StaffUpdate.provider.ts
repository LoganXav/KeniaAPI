import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria, UpdateStaffData } from "../types/StaffTypes";

export default class StaffUpdateProvider {
  public async updateOne(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any) : Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const updatedStaff = await dbClient?.staff?.update({
            where: criteria,
            data: updateData,
          });

    return updatedStaff as Promise<Staff>;
  }

  public async updateMany(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any)  : Promise<Staff[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedStaffs = await dbClient?.staff?.updateMany({
            where: criteria,
            data: updateData,
          });

    return updatedStaffs as Promise<Staff[]>;
  }

  public async addDeptToStaff(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any) : Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const updatedStaff = await dbClient?.staff?.update({
            where: criteria,
            data: {
                department: {
                    connect: { id: updateData.departmentId },
                },
            }
          });

    return updatedStaff as Promise<Staff>;
  }

  public async removeDeptFromStaff(criteria: StaffCriteria, updateData: UpdateStaffData, tx?: any) : Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const updatedStaff = await dbClient?.staff?.update({
            where: criteria,
            data: {
                department: {
                    disconnect: { id: updateData.departmentId },
                },
            }
          });

    return updatedStaff as Promise<Staff>;
  }
}
