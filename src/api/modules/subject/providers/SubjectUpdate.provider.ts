import { SubjectUpdateRequestType } from "../types/SubjectTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export default class SubjectUpdateProvider {
  public async update(criteria: SubjectUpdateRequestType, dbClient: PrismaTransactionClient = DbClient) {
    try {
      const { id, name, description, classDivisionIds, classId, tenantId, staffIds } = criteria;

      const subject = await dbClient.subject.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(classId && { classId }),
          ...(tenantId && { tenantId }),
          ...(staffIds && {
            staffs: {
              connect: staffIds.map((id) => ({ id })),
            },
          }),
          ...(classDivisionIds && {
            classDivisions: {
              connect: classDivisionIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          class: true,
        },
      });

      return subject;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
