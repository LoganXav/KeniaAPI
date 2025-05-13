import { DEV } from "~/config/ServerConfig";
import { BooleanUtil } from "~/utils/BooleanUtil";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

class PrismaProvider {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = global.prisma ?? new PrismaClient();
      if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, DEV)) {
        global.prisma = this.instance;
      }
    }
    return this.instance;
  }
}

const prisma = PrismaProvider.getInstance();

export default prisma;

export function isDuplicateError(error: unknown, key: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && (error.meta?.target as string[])?.includes?.(key);
}

export type PrismaTransactionClient = PrismaClient | Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export type PrismaDbClient = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export const TRANSACTION_MAX_WAIT = 15000;
export const TRANSACTION_TIMEOUT = 15000;
