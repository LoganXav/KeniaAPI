import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { StaffCriteria } from "../types/StaffTypes";

export default class StaffDeleteProvider {
  public async deleteOne(criteria: StaffCriteria, tx?: any): Promise<Staff | any> {
    const dbClient = tx ? tx : DbClient;
    const toDelete = await dbClient?.staff?.findFirst({
      where: criteria,
    });
    // if(!toDelete) throw new Error("Staff not found");
    if(!toDelete) return null;
    const deletedStaff = await dbClient?.staff?.delete({
        where: {id: toDelete.id},
    });
    return deletedStaff;
  }

  public async deleteMany(criteria: StaffCriteria, tx?: any): Promise<Staff | any> {
    const dbClient = tx ? tx : DbClient;
    const deletedStaff = await dbClient?.staff?.deleteMany({
        where: criteria,
    });
    return deletedStaff;
  }
}
