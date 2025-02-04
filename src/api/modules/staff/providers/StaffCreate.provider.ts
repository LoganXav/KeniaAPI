import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StaffCreateType } from "../types/StaffTypes";
import { Staff } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffCreateProvider {
  public async create(data: StaffCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, employmentType, startDate, nin, tin, highestLevelEdu, cvUrl, userId, roleId, tenantId } = data;

      const staff = await dbClient?.staff.create({
        data: {
          jobTitle,
          employmentType,
          startDate,
          nin,
          highestLevelEdu,
          tin,
          cvUrl,
          userId,
          roleId,
          tenantId,
        },
        include: {
          user: true,
          role: true,
        },
      });

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
