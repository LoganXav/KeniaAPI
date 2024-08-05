import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { CreateStaffData } from "../types/StaffTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class StaffCreateProvider {
  public async createStaff(data: CreateStaffData, tx?: any): Promise<Staff> {
    try {
      const dbClient = tx ? tx : DbClient;
      const staffData: any = {
        jobTitle: data.jobTitle,
        group: data.groupIds
          ? {
              connect: data.groupIds.map((id) => ({ id })),
            }
          : undefined,
        classes: data.classIds
          ? {
              connect: data.classIds.map((id) => ({ id })),
            }
          : undefined,
        subjects: data.subjectIds
          ? {
              connect: data.subjectIds.map((id) => ({ id })),
            }
          : undefined,
      };
      if (data.roleId !== undefined) {
        staffData.roleId = data.roleId;
      }
      if (data.userId !== undefined) {
        staffData.userId = data.userId;
      }

      const newStaff = await dbClient?.staff?.create({
        data: staffData,
      });

      return newStaff;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND);
    }
  }
}
