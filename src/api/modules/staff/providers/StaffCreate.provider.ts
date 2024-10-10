import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StaffCreateRequestType } from "../types/StaffTypes";
import { Staff, UserType } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class StaffCreateProvider {
  public async create(data: StaffCreateRequestType & { userId: number; password: string; userType: UserType }, dbClient: PrismaTransactionClient = DbClient): Promise<Staff> {
    try {
      const { jobTitle, userId } = data;

      const staff = await dbClient?.staff.create({
        data: {
          jobTitle,
          userId,
        },
      });

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
