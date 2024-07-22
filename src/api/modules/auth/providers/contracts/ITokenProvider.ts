import { TokenType, UserToken } from "@prisma/client";
import { PrismaDbClient, PrismaTransactionClient } from "~/infrastructure/internal/database";
import { ReadOneTokenRecordType, ReadTokenRecordType, UpdateTokenRecordType } from "~/api/modules/auth/types/AuthTypes";

export interface ITokenProvider {
  create(args: UserToken, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken>;

  getOneByCriteria(criteria: ReadOneTokenRecordType, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken | null>;

  getByCriteria(criteria: ReadTokenRecordType, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken[]>;

  updateOneByCriteria(criteria: UpdateTokenRecordType, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken | null>;
}
