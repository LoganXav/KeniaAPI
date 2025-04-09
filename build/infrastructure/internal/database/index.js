"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_TIMEOUT = exports.TRANSACTION_MAX_WAIT = void 0;
exports.isDuplicateError = isDuplicateError;
const client_1 = require("@prisma/client");
const ServerConfig_1 = require("../../../config/ServerConfig");
const BooleanUtil_1 = require("../../../utils/BooleanUtil");
class PrismaProvider {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = global.prisma ?? new client_1.PrismaClient();
            if (!process.env?.NODE_ENV || BooleanUtil_1.BooleanUtil.areEqual(process.env.NODE_ENV, ServerConfig_1.DEV)) {
                global.prisma = this.instance;
            }
        }
        return this.instance;
    }
}
const prisma = PrismaProvider.getInstance();
exports.default = prisma;
function isDuplicateError(error, key) {
    return error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002" && error.meta?.target?.includes?.(key);
}
exports.TRANSACTION_MAX_WAIT = 15000;
exports.TRANSACTION_TIMEOUT = 15000;
//# sourceMappingURL=index.js.map