import DbClient from "~/infrastructure/internal/database";
import { Staff } from "@prisma/client";
import { CreateStaffData, CreateStaffUserData } from "../types/StaffTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import ServerConfig from "~/config/ServerConfig";

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

  public async createStaffUser(data: CreateStaffUserData, tx?: any): Promise<any> {
    try {
      const dbClient = tx ? tx : DbClient;
      const { firstName, lastName, phoneNumber, email, tenantId, jobTitle } = data;
      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Staff);

      const newUserAndStaff = await dbClient?.$transaction(async () => {
        const newUser = await dbClient?.user.create({
          data: {
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword,
            tenantId,
            userType: "STAFF",
          },
        });

        const newStaff = await dbClient?.staff.create({
          data: {
            jobTitle,
            userId: newUser.id,
          },
        });

        return { user: newUser, staff: newStaff };
      });

      return newUserAndStaff;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND);
    }
  }
}
