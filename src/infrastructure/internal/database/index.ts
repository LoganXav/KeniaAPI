import { Prisma, PrismaClient } from "@prisma/client";
import { DEV } from "~/config/ServerConfig";
import { BooleanUtil } from "~/utils/BooleanUtil";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, DEV)) global.prisma = prisma;

export default prisma;

export function isDuplicateError(error: unknown, key: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && (error.meta?.target as string[])?.includes?.(key);
}
