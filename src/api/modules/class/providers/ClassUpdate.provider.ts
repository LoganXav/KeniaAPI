import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { Class } from "@prisma/client";
import { ClassUpdateRequestType } from "../types/ClassTypes";

export default class ClassUpdateProvider {
  public async updateOne(args: ClassUpdateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<Class> {
    const updatedClass = await dbClient?.class?.update({
      where: { id: args.id },
      data: {
        ...(args.name && { name: args.name }),
        ...(args.type && { type: args.type }),
        ...(args.classTeacherId && { classTeacherId: args.classTeacherId }),
      },
      include: {
        classTeacher: true,
        students: true,
        subjects: true,
        divisions: true,
      },
    });

    return updatedClass;
  }
}
