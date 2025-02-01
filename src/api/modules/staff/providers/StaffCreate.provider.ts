import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StaffCreateType } from "../types/StaffTypes";
import { Staff } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffCreateProvider {
  public async create(data: StaffCreateType, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, address, stateId, lgaId, countryId, zipCode, postalCode, employmentType, startDate, nin, tin, highestLevelEdu, cvUrl, userId, roleId, tenantId } = data;

      const staff = await dbClient?.staff.create({
        data: {
          jobTitle,
          address,
          stateId,
          lgaId,
          countryId,
          zipCode,
          postalCode,
          employmentType,
          startDate: startDate ? new Date(startDate) : null,
          nin,
          tin,
          highestLevelEdu,
          cvUrl,
          userId,
          roleId,
          tenantId,
        },
      });

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
