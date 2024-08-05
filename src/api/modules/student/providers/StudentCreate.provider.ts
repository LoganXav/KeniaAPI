import DbClient from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { CreateStudentData } from "../types/StudentTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

export default class StudentCreateProvider {
  public async createStudent(data: CreateStudentData, tx?: any): Promise<Student> {
    try {
      const dbClient = tx ? tx : DbClient;
      const newStudent = await dbClient?.student?.create({
        data: {
          dob: data.dob,
          address: data.address,
          enrollmentDate: data.enrollmentDate,
          classId: data.tenantId,
          tenantId: data.tenantId,
        },
      });

      return newStudent;
    } catch (error) {
      throw new BadRequestError(`${error}`, HttpStatusCodeEnum.NOT_FOUND);
    }
  }
}
