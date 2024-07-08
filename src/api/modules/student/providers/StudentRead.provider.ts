import DbClient from "~/infrastructure/internal/database";
import { Student } from "@prisma/client";
import { StudentCriteria } from "../types/StudentTypes";

export default class StudentReadProvider {
  public async getAllStudent(tx?: any): Promise<Student[]> {
    const dbClient = tx ? tx : DbClient;
    const students = await dbClient?.student?.findMany();

    return students;
  }

  public async getByCriteria(criteria: StudentCriteria, tx?: any): Promise<Student[]> {
    const dbClient = tx ? tx : DbClient;
    const students = await dbClient?.student?.findMany({
      where: criteria,
    });

    return students;
  }

  public async getOneByCriteria(criteria: StudentCriteria, tx?: any): Promise<Student> {
    const dbClient = tx ? tx : DbClient;
    const student = await dbClient?.student?.findFirst({
      where: criteria,
    });

    return student;
  }
}
