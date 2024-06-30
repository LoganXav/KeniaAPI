import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { CreateStaffData } from "../types/StaffTypes";

export default class StaffCreateProvider {
  public async createStaff(data: CreateStaffData, tx?: any): Promise<Staff> {
    const dbClient = tx ? tx : DbClient;
    const newStaff = await dbClient?.staff?.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        jobTitle: data.jobTitle,
        
        // department: {
        //   connect: data.departmentIds.map(id => ({ id })),
        // },
        // tenantId: {
        //   connect: { id: data.tenantId },
        // },
        roleListId: data.roleListId,
        // departmentIds: data.departmentIds,
        tenantId: data.tenantId,
        isFirstTimeLogin: true,
      },
    });

    return newStaff;
  }
}
