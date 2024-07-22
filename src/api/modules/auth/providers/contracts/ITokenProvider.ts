import { TokenType, UserToken } from "@prisma/client";
import { FindUserActiveTokenByTypeType, UpdateUserTokenActivationRecordType } from "~/api/shared/types/UserInternalApiTypes";
import { PrismaDbClient, PrismaTransactionClient } from "~/infrastructure/internal/database";

export interface ITokenProvider {
  createUserTokenRecord(args: UserToken, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken>;

  findUserTokensByType(args: { userId: number; tokenType: TokenType }, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken[]>;

  updateUserTokenRecord(args: UpdateUserTokenActivationRecordType, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken>;

  findUserTokenByToken(otpToken: string, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken | null>;

  findActiveUserTokenByType(args: FindUserActiveTokenByTypeType, dbClient: PrismaTransactionClient | PrismaDbClient): Promise<UserToken | null>;
}
