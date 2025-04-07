import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { TermCriteriaType } from "../types/TermTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { Term } from "@prisma/client";

export default class TermReadProvider {
  public async getByCriteria(criteria: TermCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<TermType[]> {
    try {
      const { id, ids, calendarId, tenantId } = criteria;

      const terms = await dbClient.term.findMany({
        where: {
          ...(id && { id }),
          ...(ids && { id: { in: ids } }),
          ...(calendarId && { calendarId }),
          ...(tenantId && { tenantId }),
        },
        include: {
          calendar: true,
          breakWeeks: true,
        },
      });

      return terms;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: TermCriteriaType, dbClient: PrismaTransactionClient = DbClient): Promise<any> {
    try {
      const { id, calendarId, tenantId } = criteria;

      const term = await dbClient.term.findFirst({
        where: {
          ...(id && { id: Number(id) }),
          ...(calendarId && { calendarId: Number(calendarId) }),
          ...(tenantId && { tenantId: Number(tenantId) }),
        },
        include: {
          breakWeeks: true,
        },
      });

      return term;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
import { Prisma } from "@prisma/client";
import { TermType } from "../../schoolCalendar/types/SchoolCalendarTypes";
