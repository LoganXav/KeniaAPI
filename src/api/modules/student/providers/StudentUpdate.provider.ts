import DbClient from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { StudentCriteria, UpdateStudentData } from "../types/StudentTypes";

export default class StudentUpdateProvider {
  public async updateOne(criteria: StudentCriteria, updateData: UpdateStudentData, tx?: any) : Promise<Student> {
    const dbClient = tx ? tx : DbClient;
    const updatedStudent = await dbClient?.student?.update({
            where: criteria,
            data: updateData,
          });

    return updatedStudent as Promise<Student>;
  }

  public async updateMany(criteria: StudentCriteria, updateData: UpdateStudentData, tx?: any)  : Promise<Student[]> {
    const dbClient = tx ? tx : DbClient;
    const updatedStudents = await dbClient?.student?.updateMany({
            where: criteria,
            data: updateData,
          });

    return updatedStudents as Promise<Student[]>;
  }
}
